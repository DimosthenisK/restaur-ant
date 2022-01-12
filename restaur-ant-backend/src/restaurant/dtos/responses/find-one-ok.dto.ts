import { Restaurant } from '../../../generated/dto/restaurant/entities';

export class FindOneRestaurantOkResponse {
  success = true;
  data: Restaurant;
}
