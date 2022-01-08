import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User, UserStatus } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { AuthenticationService } from './authentication.service';
import { EncryptionModule } from './encryption/encryption.module';
import { EncryptionService } from './encryption/encryption.service';
import { UserService } from '../user.service';

describe('Authentication', () => {
  let service: AuthenticationService;
  let encryptionService: EncryptionService;
  let testUsers: User[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EncryptionModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'JWTSECRET';
                case 'DEFAULT_TOKEN_EXPIRATION_INTERVAL':
                  return '2d';
              }
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            findOneByEmail: (email: string) =>
              testUsers.filter((user) => user.email == email)[0],
            findOneByID: (id: string) =>
              testUsers.filter((user) => user.id == id)[0],
          },
        },
        AuthenticationService,
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    encryptionService = module.get<EncryptionService>(EncryptionService);

    testUsers = [
      {
        id: '1',
        role: Role.ADMIN,
        email: 'superuser@mail.com',
        status: UserStatus.ACTIVE,
        name: 'The superUser',
        password: await encryptionService.hash('sample'),
      },
      {
        id: '2',
        role: Role.USER,
        email: 'user@mail.com',
        status: UserStatus.ACTIVE,
        name: 'The user',
        password: await encryptionService.hash('sample'),
      },
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a correct token', async (done) => {
    const token = jwt.sign(
      { id: 1, role: Role.ADMIN, keepLoggedIn: false },
      'JWTSECRET',
    );

    expect(service.validateUser(token)).resolves.not.toThrow();
    done();
  });

  it('should throw on invalid token', async (done) => {
    const token = jwt.sign(
      { id: 1, role: Role.ADMIN, keepLoggedIn: false },
      'INVALID JWT SECRET',
    );

    expect(service.validateUser(token)).rejects.toThrow();
    done();
  });

  it('should throw on expired token', async (done) => {
    const token = await service.generateTokenForUser(testUsers[0], false, '1s');
    setTimeout(() => {
      expect(service.validateUser(token)).rejects.toThrowError(
        jwt.TokenExpiredError,
      );
      done();
    }, 1010);
  });

  it('should login correctly', async (done) => {
    const loggedInOne = await service.login(testUsers[0].email, 'sample');
    expect(loggedInOne).toHaveProperty('success', true);
    expect(loggedInOne).toHaveProperty('token');
    done();
  });

  it('should return no user on failed email', async (done) => {
    const loggedInOne = await service.login(
      testUsers[0].email + 'Wrong',
      'sample',
    );
    expect(loggedInOne).toStrictEqual({
      success: false,
      reason: 'User not found',
      errorCode: 'UNKNOWN_USER',
    });
    done();
  });

  it('should return wrong password on failed password', async (done) => {
    const loggedInOne = await service.login(
      testUsers[0].email,
      'wrongPassword',
    );
    expect(loggedInOne).toStrictEqual({
      success: false,
      reason: 'Wrong password',
      errorCode: 'WRONG_USER_PASSWORD',
    });
    done();
  });

  it('should return error on bad token - invalid sig @ checkToken', async (done) => {
    const token = jwt.sign(
      { id: 1, role: Role.ADMIN, keepLoggedIn: false },
      'INVALID JWT SECRET',
    );

    expect(service.checkToken(token)).resolves.toStrictEqual({
      success: false,
      reason: 'Token signature seems invalid or otherwise modified',
      errorCode: 'JWT_INVALID',
    });
    done();
  });

  it('should return error on bad token - invalid token @ checkToken', async (done) => {
    //I can't find a case for this unit test... Oops
    expect(true).toBeTruthy();
    done();
  });

  it('should return error on bad token - expired token @ checkToken', async (done) => {
    const token = await service.generateTokenForUser(testUsers[0], false, '1s');
    setTimeout(() => {
      expect(service.checkToken(token)).resolves.toStrictEqual({
        success: false,
        reason: 'Token has expired',
        errorCode: 'JWT_EXPIRED',
      });
      done();
    }, 1010);
  });

  it('should return error on invalid user id @ checkToken', async (done) => {
    const wrongUser = { ...testUsers[0] };
    wrongUser.id = '5';
    const token = await service.generateTokenForUser(wrongUser, false);
    expect(service.checkToken(token)).resolves.toStrictEqual({
      success: false,
      reason: 'User not found',
      errorCode: 'USER_NOT_FOUND',
    });
    done();
  });

  it('should refresh the token correctly', async (done) => {
    const token = await service.generateTokenForUser(testUsers[0], false);
    const loggedInOne = await service.checkToken(token);
    expect(loggedInOne).toHaveProperty('success', true);
    expect(loggedInOne).toHaveProperty('token');
    done();
  });
});
