import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoSrvUrlFactory } from './mongo-sv.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule acessível globalmente
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule para usar ConfigService
      inject: [ConfigService], // Injeta ConfigService para resolver a URL dinamicamente
      useFactory: (configService: ConfigService) => {
        const mongoUrlFactory = new MongoSrvUrlFactory(configService);
        return {
          uri: mongoUrlFactory.get(), // Obtém a URL do MongoDB da factory
        };
      },
    }),
  ],
})
export class MongoModule {}
