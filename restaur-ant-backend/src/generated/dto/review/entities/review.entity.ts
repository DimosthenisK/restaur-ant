
import {Restaurant} from '../../restaurant/entities/restaurant.entity'
import {User} from '../../user/entities/user.entity'


export class Review {
  id: string ;
rating: number ;
comment: string ;
dateOfVisit: Date ;
restaurantId: string ;
userId: string ;
restaurant?: Restaurant ;
user?: User ;
}
