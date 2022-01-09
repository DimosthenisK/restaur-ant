import { IsOptional, Length } from 'class-validator';
import { UpdateRestaurantDto as GeneratedUpdateRestaurantDto } from '../../../generated/dto/restaurant/dto/update-restaurant.dto';

export class UpdateRestaurantDto extends GeneratedUpdateRestaurantDto {
  @IsOptional()
  @Length(3, 255)
  name?: string;

  @IsOptional()
  @Length(3, 255)
  address?: string;

  @IsOptional()
  @Length(8, 255)
  phone?: string;

  @IsOptional()
  @Length(1, 500)
  description?: string;
}
