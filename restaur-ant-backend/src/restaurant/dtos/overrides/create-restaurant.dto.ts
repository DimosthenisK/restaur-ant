import { Length } from 'class-validator';
import { CreateRestaurantDto as GeneratedCreateRestaurantDto } from '../../../generated/dto/restaurant/dto/create-restaurant.dto';

export class CreateRestaurantDto extends GeneratedCreateRestaurantDto {
  @Length(3, 255)
  name: string;
  @Length(3, 255)
  address: string;
  @Length(8, 255)
  phone: string;
  @Length(1, 500)
  description: string;
}
