import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AtendentServices,
  AtendentServicesSchema,
} from './atendent-services.schema';
import { AtendentServicesMapper } from './atendent-services.mapper';
import { AtendentServicesRepository } from './atendent-services.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AtendentServices.name, schema: AtendentServicesSchema },
    ]),
  ],
  providers: [
    AtendentServicesMapper,
    {
      provide: AtendentServicesRepository,
      useFactory: (
        model: Model<AtendentServices>,
        mapper: AtendentServicesMapper,
      ) => {
        return new AtendentServicesRepository(model, mapper);
      },
      inject: [getModelToken(AtendentServices.name), AtendentServicesMapper],
    },
  ],
  exports: [AtendentServicesRepository],
})
export class AtendentServicesDatabaseModule {}
