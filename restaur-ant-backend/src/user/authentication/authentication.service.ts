import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { EncryptionService } from './encryption/encryption.service';
import { UserService } from '../user.service';

export interface tokenInfo {
  id: number;
  role: Role;
  keepLoggedIn: boolean;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async validateUser(token: string): Promise<User | false> {
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      ) as tokenInfo;
    } catch (err) {
      throw err;
    }
    return await this.usersService.findOneByID(tokenInfo.id);
  }

  async generateTokenForUser(
    user: User,
    keepLoggedIn = false,
    expiration?: string,
  ) {
    expiration = expiration
      ? expiration
      : this.configService.get('DEFAULT_TOKEN_EXPIRATION_INTERVAL') || '2d';
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.role,
        keepLoggedIn,
      },
      this.configService.get('JWT_SECRET'),
      { expiresIn: expiration },
    );
  }

  async login(email: string, password: string, keepLoggedIn = false) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user)
      return {
        success: false,
        reason: 'User not found',
        errorCode: 'UNKNOWN_USER',
      };

    const isPasswordCorrect = await this.encryptionService.verify(
      password,
      user.password,
    );
    if (!isPasswordCorrect)
      return {
        success: false,
        reason: 'Wrong password',
        errorCode: 'WRONG_USER_PASSWORD',
      };

    return {
      success: true,
      token: await this.generateTokenForUser(user, keepLoggedIn),
    };
  }

  async checkToken(token: string) {
    let user;
    try {
      user = await this.validateUser(token);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return {
          success: false,
          reason: 'Token has expired',
          errorCode: 'JWT_EXPIRED',
        };
      } else if (err instanceof jwt.JsonWebTokenError) {
        return {
          success: false,
          reason: 'Token signature seems invalid or otherwise modified',
          errorCode: 'JWT_INVALID',
        };
      } else {
        return {
          success: false,
          reason:
            'An unknown error has occured. This incident has been reported.',
          errorCode: 'UNKNOWN_ERROR',
        };
      }
    }

    if (user)
      return {
        success: true,
        token: await this.generateTokenForUser(user, true),
      };
    else
      return {
        success: false,
        reason: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      };
  }

  async changePassword(user: User, newPassword: string, oldPassword?: string);
  async changePassword(
    userId: string,
    newPassword: string,
    oldPassword?: string,
  );
  async changePassword(
    userOrUserId: User | string,
    newPassword: string,
    oldPassword?: string,
  ) {
    let user: User;
    if (typeof userOrUserId == 'string')
      user = await this.usersService.findOneByID(userOrUserId);
    else user = userOrUserId;

    if (oldPassword) {
      const isOldPasswordCorrect = await this.encryptionService.verify(
        oldPassword,
        user.password,
      );
      if (!isOldPasswordCorrect)
        return {
          success: false,
          reason: 'Wrong password',
          errorCode: 'WRONG_USER_PASSWORD',
        };
    }

    const passChangeOperation = await this.usersService.changePassword(
      user,
      newPassword,
    );
    return { success: true };
  }
}
