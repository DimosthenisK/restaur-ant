import { IsIn } from 'class-validator';
import { CreateUserDto as GeneratedCreateUserDto } from '../../../generated/dto/user/dto/create-user.dto';

export class UpdateUserRoleDto extends GeneratedCreateUserDto {
  @IsIn(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';
}
