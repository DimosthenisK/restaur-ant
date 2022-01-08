import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [ReviewModule],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [ReviewModule, RestaurantService],
})
export class RestaurantModule {}
