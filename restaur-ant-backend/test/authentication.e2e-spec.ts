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

describe('Authentication Controller (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let bcryptService: BcryptService;
  let authenticationService: AuthenticationService;
  let testUserUser: User;
  let testUserToken: string;
  let testUserPassword: string;
  let testAdminUser: User;
  let testAdminToken: string;
  let testAdminPassword: string;
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

    testUserPassword = Faker.internet.password();
    testAdminPassword = Faker.internet.password();
    testUserUser = await prismaService.user.create({
      data: {
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: await bcryptService.hash(testUserPassword),
        role: 'USER',
      },
    });
    testAdminUser = await prismaService.user.create({
      data: {
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: await bcryptService.hash(testAdminPassword),
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

  it('/authentication/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({
        email: testUserUser.email,
        password: testUserPassword,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
  });

  it('/authentication/login (POST) [Wrong email]', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({
        email: testUserUser.email + 'wrong',
        password: testUserPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('/authentication/login (POST) [Missing email]', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({
        password: testUserPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errorCode).toBe('VALIDATION_ERROR');
  });
});
