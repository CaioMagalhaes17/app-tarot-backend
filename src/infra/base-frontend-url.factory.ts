import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BaseFrontendUrlFactory {
  constructor(private configService: ConfigService) {}
  get(): string {
    const ENV = this.configService.get<string>('ENV');
    switch (ENV) {
      case 'local':
        return this.configService.get<string>('FRONTEND_URL_LOCAL');
      case 'hml':
        return this.configService.get<string>('FRONTEND_URL_HML');
      case 'prod':
        return this.configService.get<string>('FRONTEND_URL_PROD');
      default:
        return this.configService.get<string>('FRONTEND_URL_LOCAL');
    }
  }
}
