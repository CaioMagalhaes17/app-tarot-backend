import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Services, ServicesSchema } from './services.schema';
import { ServicesMapper } from './services.mapper';
import { ServicesRepository } from './services.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Services.name, schema: ServicesSchema },
    ]),
  ],
  providers: [
    ServicesMapper,
    {
      provide: ServicesRepository,
      useFactory: (model: Model<Services>, mapper: ServicesMapper) => {
        return new ServicesRepository(model, mapper);
      },
      inject: [getModelToken(Services.name), ServicesMapper],
    },
  ],
  exports: [ServicesRepository, ServicesMapper],
})
export class ServicesDatabaseModule {}
