import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { EncryptionService } from './encryption.service';

@Module({
  providers: [EncryptionService, BcryptService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
