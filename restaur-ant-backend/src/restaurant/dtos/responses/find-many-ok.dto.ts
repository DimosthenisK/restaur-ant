import { Restaurant } from '../../../generated/dto/restaurant/entities';

export class FindManyRestaurantOkResponse {
  success = true;
  page: number;
  data: Array<Restaurant & { _avgrating: number | null }>;
}
