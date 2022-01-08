import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { HttpStrategy } from './authentication.strategy';
import { EncryptionModule } from './encryption/encryption.module';
import { BearerAuthGuard } from './guards/bearer.guard';
import { RolesGuard } from './guards/roles.guard';
import { SelfGuard } from './guards/self.guard';
import { UserModule } from '../user.module';

@Module({
  imports: [PassportModule, forwardRef(() => UserModule), EncryptionModule],
  providers: [
    AuthenticationService,
    HttpStrategy,
    RolesGuard,
    BearerAuthGuard,
    SelfGuard,
  ],
  exports: [
    AuthenticationService,
    PassportModule,
    RolesGuard,
    BearerAuthGuard,
    SelfGuard,
    EncryptionModule,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
