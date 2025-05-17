import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Atendent, AtendentSchema } from './atendent.schema';
import { AtendentMapper } from './atendent.mapper';
import { AtendentRepository } from './atendent.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Atendent.name, schema: AtendentSchema },
    ]),
  ],
  providers: [
    AtendentMapper,
    {
      provide: AtendentRepository,
      useFactory: (model: Model<Atendent>, mapper: AtendentMapper) => {
        return new AtendentRepository(model, mapper);
      },
      inject: [getModelToken(Atendent.name), AtendentMapper],
    },
  ],
  exports: [AtendentRepository],
})
export class AtendentDatabaseModule {}
