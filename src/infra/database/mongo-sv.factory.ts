import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoSrvUrlFactory {
  constructor(private configService: ConfigService) {}
  get(): string {
    const ENV = this.configService.get<string>('ENV');
    switch (ENV) {
      case 'local':
        return this.configService.get<string>('MONGO_SRV_LOCAL');
      case 'hml':
        return this.configService.get<string>('MONGO_SRV_HML');
      case 'prod':
        return this.configService.get<string>('MONGO_SRV_HML');
      default:
        return this.configService.get<string>('MONGO_SRV_LOCAL');
    }
  }
}
