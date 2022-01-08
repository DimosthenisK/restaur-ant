import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
