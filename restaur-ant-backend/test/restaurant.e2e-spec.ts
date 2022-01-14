import { Test, TestingModule } from '@nestjs/testing';
import { Restaurant, User } from '@prisma/client';
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

describe('Restaurant Controller (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let bcryptService: BcryptService;
  let authenticationService: AuthenticationService;
  let testUserUser: User;
  let testUserToken: string;
  let testAdminUser: User;
  let testAdminToken: string;
  let testRestaurant: Restaurant;
  let additionalUserIDs: string[] = [];

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
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({
      where: {
        id: { in: [testUserUser.id, testAdminUser.id, ...additionalUserIDs] },
      },
    });
    additionalUserIDs = [];

    await prismaService.restaurant.delete({ where: { id: testRestaurant.id } });
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/restaurant')
      .send({
        name: Faker.company.companyName(),
        address: Faker.address.streetAddress(),
        phone: Faker.phone.phoneNumber(),
        description: Faker.lorem.paragraph(),
      })
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Restaurant created successfully');
    expect(response.body.data).toBeTruthy();

    additionalUserIDs.push(response.body.data);
  });

  it('/:id (PATCH) [From Admin]', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/restaurant/${testRestaurant.id}`)
      .send({
        name: 'NEW NAME',
      })
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Restaurant updated successfully');
    expect(response.body.data).toBeTruthy();

    const restaurant = await prismaService.restaurant.findUnique({
      where: { id: testRestaurant.id },
    });
    expect(restaurant.name).toBe('NEW NAME');
  });

  it('/:id (PATCH) [From User] [toThrow Unauthorized]', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/restaurant/${testRestaurant.id}`)
      .send({
        name: 'NEW NAME',
      })
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(403);
  });

  it('/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/restaurant/${testRestaurant.id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeTruthy();
  });

  it('/:page (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/restaurant/1`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeTruthy();
  });

  it('/:id (DELETE) [From Admin]', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/restaurant/${testRestaurant.id}`)
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Restaurant deleted successfully');
    expect(response.body.data).toBeTruthy();

    const restaurant = await prismaService.restaurant.findUnique({
      where: { id: testRestaurant.id },
    });
    expect(restaurant.status).toBe('INACTIVE');
  });

  it('/:id (DELETE) [From User] [toThrow Unauthorized]', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/restaurant/${testRestaurant.id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(403);
  });
});
