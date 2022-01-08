
import {RestaurantStatus} from '@prisma/client'
import {Review} from '../../review/entities/review.entity'


export class Restaurant {
  id: string ;
name: string ;
status: RestaurantStatus ;
Reviews?: Review[] ;
}
