import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { checkTokenDto } from './dto/checktoken.dto';
import { loginDto } from './dto/login.dto';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import {
  CheckTokenBadRequestResponse,
  CheckTokenOKResponse,
  LoginBadRequestResponse,
  LoginOKResponse,
} from './dto/responses';

@ApiTags('User')
@Controller('authentication')
export class AuthenticationController {
  constructor(public service: AuthenticationService) {}

  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({ type: () => LoginOKResponse })
  @ApiBadRequestResponse({ type: () => LoginBadRequestResponse })
  async login(
    @Body() body: loginDto,
  ): Promise<LoginOKResponse | LoginBadRequestResponse> {
    const loginResponse = await this.service.login(
      body.email,
      body.password,
      body.keepLoggedIn,
    );

    if (loginResponse.success) return loginResponse as LoginOKResponse;
    else throw new BadRequestException(loginResponse);
  }

  @Post('/check-token')
  @HttpCode(200)
  @ApiOkResponse({ type: () => CheckTokenOKResponse })
  @ApiBadRequestResponse({ type: () => CheckTokenBadRequestResponse })
  async checkToken(
    @Body() body: checkTokenDto,
  ): Promise<CheckTokenOKResponse | CheckTokenBadRequestResponse> {
    const checkTokenResponse = await this.service.checkToken(body.token);

    if (checkTokenResponse.success) return checkTokenResponse;
    else throw new BadRequestException(checkTokenResponse);
  }
}
