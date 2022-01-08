import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { checkTokenDto } from './dto/checktoken.dto';
import { loginDto } from './dto/login.dto';

@ApiTags('User')
@Controller('authentication')
export class AuthenticationController {
  constructor(public service: AuthenticationService) {}

  @Post('/login')
  async login(@Body() body: loginDto) {
    return await this.service.login(
      body.email,
      body.password,
      body.keepLoggedIn,
    );
  }

  @Post('/check-token')
  async checkToken(@Body() body: checkTokenDto) {
    return await this.service.checkToken(body.token);
  }
}
