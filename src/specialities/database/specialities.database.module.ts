import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Specialities, SpecialitiesSchema } from './specialities.schema';
import { SpecialitiesMapper } from './specialities.mapper';
import { SpecialitiesRepository } from './specialities.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Specialities.name, schema: SpecialitiesSchema },
    ]),
  ],
  providers: [
    SpecialitiesMapper,
    {
      provide: SpecialitiesRepository,
      useFactory: (model: Model<Specialities>, mapper: SpecialitiesMapper) => {
        return new SpecialitiesRepository(model, mapper);
      },
      inject: [getModelToken(Specialities.name), SpecialitiesMapper],
    },
  ],
  exports: [SpecialitiesRepository],
})
export class SpecialitiesDatabaseModule {}
