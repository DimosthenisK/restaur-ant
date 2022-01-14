import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
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

describe('User Controller (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let bcryptService: BcryptService;
  let authenticationService: AuthenticationService;
  let testUserUser: User;
  let testUserToken: string;
  let testAdminUser: User;
  let testAdminToken: string;
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
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({
      where: {
        id: { in: [testUserUser.id, testAdminUser.id, ...additionalUserIDs] },
      },
    });
    additionalUserIDs = [];
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/user').send({
      name: Faker.name.findName(),
      email: Faker.internet.email(),
      password: Faker.internet.password(),
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.data).toBeTruthy();

    additionalUserIDs.push(response.body.data);
  });

  it('/:id/role (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user/${testUserUser.id}/role`)
      .send({
        role: 'ADMIN',
      })
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User updated successfully');
    expect(response.body.data).toBeTruthy();

    additionalUserIDs.push(response.body.data);
  });

  it('/:id/role (PATCH) [toThrow VALIDATION_ERROR]', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user/${testUserUser.id}/role`)
      .send({
        role: 'RANDOM',
      })
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errorCode).toBe('VALIDATION_ERROR');
  });

  it('/:id (PATCH) [From Admin]', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user/${testUserUser.id}`)
      .send({
        name: 'NEW NAME',
      })
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User updated successfully');
    expect(response.body.data).toBeTruthy();

    const user = await prismaService.user.findUnique({
      where: { id: testUserUser.id },
    });
    expect(user.name).toBe('NEW NAME');
  });

  it('/:id (PATCH) [From User] [toThrow Unauthorized]', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user/${testUserUser.id}`)
      .send({
        name: 'NEW NAME',
      })
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(403);
  });

  it('/ (PATCH) [From User Self]', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user`)
      .send({
        name: 'NEW NAME',
      })
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User updated successfully');
    expect(response.body.data).toBeTruthy();

    const user = await prismaService.user.findUnique({
      where: { id: testUserUser.id },
    });
    expect(user.name).toBe('NEW NAME');
  });

  it('/:id (GET) [From Admin]', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${testUserUser.id}`)
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeTruthy();
  });

  it('/:id (GET) [From User] [toThrow Unauthorized]', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${testUserUser.id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(403);
  });

  it('/:id (DELETE) [From Admin]', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/user/${testUserUser.id}`)
      .set('Authorization', `Bearer ${testAdminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User deleted successfully');
    expect(response.body.data).toBeTruthy();

    const user = await prismaService.user.findUnique({
      where: { id: testUserUser.id },
    });
    expect(user.status).toBe('INACTIVE');
  });

  it('/:id (DELETE) [From User] [toThrow Unauthorized]', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/user/${testUserUser.id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(response.statusCode).toBe(403);
  });
});
