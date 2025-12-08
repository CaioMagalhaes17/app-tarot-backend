import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AtendentServices,
  AtendentServicesSchema,
} from './atendent-services.schema';
import { AtendentServicesMapper } from './atendent-services.mapper';
import { AtendentServicesRepository } from './atendent-services.repository';
import { ServicesMapper } from 'src/services/database/services.mapper';
import { AtendentMapper } from 'src/atendent/database/atendent.mapper';
import { ServicesDatabaseModule } from 'src/services/database/services.database.module';
import { AtendentDatabaseModule } from 'src/atendent/database/atendent.database.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AtendentServices.name, schema: AtendentServicesSchema },
    ]),
    ServicesDatabaseModule,
    AtendentDatabaseModule,
  ],
  providers: [
    {
      provide: AtendentServicesMapper,
      useFactory: (
        serviceMapper: ServicesMapper,
        atendentMapper: AtendentMapper,
      ) => {
        return new AtendentServicesMapper(serviceMapper, atendentMapper);
      },
      inject: [ServicesMapper, AtendentMapper],
    },
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
  exports: [AtendentServicesRepository, AtendentServicesMapper],
})
export class AtendentServicesDatabaseModule {}
