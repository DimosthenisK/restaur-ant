import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super();
  }

  async validate(token: string) {
    const user = await this.authService.validateUser(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
