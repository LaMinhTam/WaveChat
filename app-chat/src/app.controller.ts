import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('')
  getHello(): string {
    console.log('getHello()');
    return this.appService.getHello();
  }

  @Get('config')
  async getConfigNumberSocket() {
    console.log('getConfig()');
    // return global['io'].fetchSockets().length;
    const data = await this.appService.getConfigNumberSocket();

    return data;
  }
}
