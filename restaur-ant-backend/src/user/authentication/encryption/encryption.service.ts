import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from './bcrypt/bcrypt.service';

@Injectable()
export class EncryptionService {
  enable: boolean;
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
  ) {
    this.enable = Boolean(
      Number(configService.get<boolean>('ENABLE_ENCRYPTION')),
    );
  }

  async hash(password: string): Promise<string> {
    return this.enable ? await this.bcryptService.hash(password) : password;
  }

  async verify(password: string, encrypted: string): Promise<boolean> {
    return this.enable
      ? await this.bcryptService.compare(password, encrypted)
      : password == encrypted;
  }
}
