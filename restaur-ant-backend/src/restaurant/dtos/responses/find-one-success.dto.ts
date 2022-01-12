import { Restaurant } from '../../../generated/dto/restaurant/entities';

export class FindOneSuccessRestaurantDto {
  success = true;
  data: Restaurant;
}
