import { IsIn } from 'class-validator';
import { UpdateUserDto as GeneratedUpdateUserDto } from '../../../generated/dto/user/dto/update-user.dto';

export class UpdateUserRoleDto extends GeneratedUpdateUserDto {
  @IsIn(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';
}
