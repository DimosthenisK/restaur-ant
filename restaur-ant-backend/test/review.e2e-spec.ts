import { Test, TestingModule } from '@nestjs/testing';
import { Restaurant, Review, User } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthenticationService } from '../src/user/authentication/authentication.service';
import { BcryptService } from '../src/user/authentication/encryption/bcrypt/bcrypt.service';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
const Faker = require('@faker-js/faker');

describe('Review Controller (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let bcryptService: BcryptService;
  let authenticationService: AuthenticationService;
  let testUserUser: User;
  let testUserToken: string;
  let testAdminUser: User;
  let testAdminToken: string;
  let testRestaurant: Restaurant;
  let testReview: Review;
  let additionalReviewIDs: string[] = [];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: (errors) => {
          const property = errors[0].property;
          const reason = Object.values(errors[0].constraints)[0];
          throw new BadRequestException({
            success: false,
            message: `${property}|${reason}}`,
            errorCode: 'VALIDATION_ERROR',
          });
        },
      }),
    );
    await app.init();
    prismaService = app.get(PrismaService);
    bcryptService = app.get(BcryptService);
    authenticationService = app.get(AuthenticationService);

    testUserUser = await prismaService.user.create({
      data: {
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: await bcryptService.hash(Faker.internet.password()),
        role: 'USER',
      },
    });
    testAdminUser = await prismaService.user.create({
      data: {
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: await bcryptService.hash(Faker.internet.password()),
        role: 'ADMIN',
      },
    });
    testUserToken = await authenticationService.generateTokenForUser(
      testUserUser,
    );
    testAdminToken = await authenticationService.generateTokenForUser(
      testAdminUser,
    );

    testRestaurant = await prismaService.restaurant.create({
      data: {
        name: Faker.company.companyName(),
        address: Faker.address.streetAddress(),
        phone: Faker.phone.phoneNumber(),
        description: Faker.lorem.paragraph(),
      },
    });

    testReview = await prismaService.review.create({
      data: {
        rating: Faker.datatype.number({ min: 1, max: 5 }),
        comment: Faker.lorem.paragraph(),
        userId: testUserUser.id,
        restaurantId: testRestaurant.id,
        dateOfVisit: new Date(),
      },
    });
  });

  afterEach(async () => {
    await prismaService.review.deleteMany({
      where: { id: { in: [testReview.id, , ...additionalReviewIDs] } },
    });
    await prismaService.user.deleteMany({
      where: {
        id: { in: [testUserUser.id, testAdminUser.id] },
      },
    });
    await prismaService.restaurant.delete({
      where: { id: testRestaurant.id },
    });

    additionalReviewIDs = [];
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/restaurant/${testRestaurant.id}/review`)
      .send({
        rating: Faker.datatype.number({ min: 1, max: 5 }),
        comment: Faker.lorem.paragraph(),
        dateOfVisit: new Date().toISOString().split('T')[0],
      })
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Review created successfully');
    expect(response.body.data).toBeTruthy();

    additionalReviewIDs.push(response.body.data);
  });

  it('/:id (PATCH) [From Admin]', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/restaurant/${testRestaurant.id}/review/${testReview.id}`)
      .send({
        comment: 'NEW COMMENT',
      })
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Review updated successfully');
    expect(response.body.data).toBeTruthy();

    const review = await prismaService.review.findUnique({
      where: { id: testReview.id },
    });
    expect(review.comment).toBe('NEW COMMENT');
  });

  it('/:id (PATCH) [From User] [toThrow Unauthorized]', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/restaurant/${testRestaurant.id}/review/${testReview.id}`)
      .send({
        comment: 'COMMENT',
      })
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(403);
  });

  it('/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/restaurant/${testRestaurant.id}/review/${testReview.id}`)
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeTruthy();
  });

  it('/:id (DELETE) [From Admin]', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/restaurant/${testRestaurant.id}/review/${testReview.id}`)
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Review deleted successfully');
    expect(response.body.data).toBeTruthy();

    const review = await prismaService.review.findUnique({
      where: { id: testReview.id },
    });
    expect(review.status).toBe('DELETED');
  });

  it('/:id (DELETE) [From User] [toThrow Unauthorized]', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/restaurant/${testRestaurant.id}/review/${testReview.id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(403);
  });
});
