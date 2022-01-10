import { IsBoolean, IsOptional, Length } from 'class-validator';

export class loginDto {
  @Length(3, 255)
  email: string;
  @Length(8, 255)
  password: string;
  @IsOptional()
  @IsBoolean()
  keepLoggedIn?: boolean;
}
