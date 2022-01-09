
import {UserStatus,Role} from '@prisma/client'
import {Review} from '../../review/entities/review.entity'


export class User {
  id: string ;
name: string ;
email: string ;
password: string ;
status: UserStatus ;
role: Role ;
createdAt: Date ;
Reviews?: Review[] ;
}
