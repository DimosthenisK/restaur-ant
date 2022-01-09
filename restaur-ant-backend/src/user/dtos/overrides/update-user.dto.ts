import { IsEmail, IsOptional, Length } from 'class-validator';
import { UpdateUserDto as GeneratedUpdateUserDto } from '../../../generated/dto/user/dto/update-user.dto';

export class UpdateUserDto extends GeneratedUpdateUserDto {
  @IsOptional()
  @Length(3, 255)
  name: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 255)
  email: string;

  @IsOptional()
  @Length(8, 255)
  password: string;
}
