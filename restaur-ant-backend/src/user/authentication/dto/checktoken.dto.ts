import { Length } from 'class-validator';

export class checkTokenDto {
  @Length(1, 1000)
  token: string;
}
