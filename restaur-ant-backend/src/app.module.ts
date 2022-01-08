import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ReviewModule } from './restaurant/review/review.module';
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
      {
        path: '/restaurant',
        module: RestaurantModule,
        children: [{ path: '/:restaurantId/review', module: ReviewModule }],
      },
    ]),
    UserModule,
    RestaurantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
