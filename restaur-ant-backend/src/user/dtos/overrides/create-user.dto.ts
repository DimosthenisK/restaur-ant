import { IsEmail, Length } from 'class-validator';
import { CreateUserDto as GeneratedCreateUserDto } from '../../../generated/dto/user/dto/create-user.dto';

export class CreateUserDto extends GeneratedCreateUserDto {
  @Length(3, 255)
  name: string;

  @IsEmail()
  @Length(3, 255)
  email: string;

  @Length(8, 255)
  password: string;
}
