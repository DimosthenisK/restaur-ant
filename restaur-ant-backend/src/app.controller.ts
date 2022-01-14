import { Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/seed')
  async seed() {
    console.log(this.configService.get('NODE_ENV'));
    if (this.configService.get('NODE_ENV') === 'DEV') {
      return await this.appService.seed();
    }
    return false;
  }
}
