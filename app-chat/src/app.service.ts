import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BaseResponse } from './shared';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    console.log('AppService.constructor()');
  }
  async getConfigNumberSocket() {
    const numService1: number =
      (await this.cacheManager.get(`SOCKET_SERVER:SIZE:${4002}`)) || 0;
    const numService2: number =
      (await this.cacheManager.get(`SOCKET_SERVER:SIZE:${4003}`)) || 0;

    const serverPort = numService1 >= numService2 ? 4003 : 4002;

    return new BaseResponse(200, 'SUCCESS', {
      socket_port: serverPort,
    });
  }

  getHello(): string {
    return 'Good day, can u hear me?';
  }
}
