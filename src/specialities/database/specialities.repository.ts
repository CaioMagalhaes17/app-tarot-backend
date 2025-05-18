import { BaseInfraRepository } from 'src/core/base.repository';
import { Model } from 'mongoose';
import { SpecialitiesEntity } from '../specialities.entity';
import { Specialities } from './specialities.schema';
import { SpecialitiesMapper } from './specialities.mapper';

export class SpecialitiesRepository extends BaseInfraRepository<
  Specialities,
  SpecialitiesEntity
> {
  constructor(
    protected readonly model: Model<Specialities>,
    protected readonly mapper: SpecialitiesMapper,
  ) {
    super(model, mapper);
  }
}
