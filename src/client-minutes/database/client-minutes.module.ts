import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientMinutes, ClientMinutesSchema } from './client-minutes.schema';
import { ClientMinutesMapper } from './client-minutes.mapper';
import { ClientMinutesRepository } from './client-minutes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientMinutes.name, schema: ClientMinutesSchema },
    ]),
  ],
  providers: [
    ClientMinutesMapper,
    {
      provide: ClientMinutesRepository,
      useFactory: (
        model: Model<ClientMinutes>,
        mapper: ClientMinutesMapper,
      ) => {
        return new ClientMinutesRepository(model, mapper);
      },
      inject: [getModelToken(ClientMinutes.name), ClientMinutesMapper],
    },
  ],
  exports: [ClientMinutesRepository],
})
export class ClientMinutesDatabaseModule {}
