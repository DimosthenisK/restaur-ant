import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RouterModule.register([
      {
        path: '/user',
        module: UserModule,
      },
    ]),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
