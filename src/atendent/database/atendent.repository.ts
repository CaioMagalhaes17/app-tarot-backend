import { BaseInfraRepository } from 'src/core/base.repository';
import { Model } from 'mongoose';
import { Atendent } from './atendent.schema';
import { AtendentEntity } from '../atendent.entity';
import { AtendentMapper } from './atendent.mapper';

export class AtendentRepository extends BaseInfraRepository<
  Atendent,
  AtendentEntity
> {
  constructor(
    protected readonly model: Model<Atendent>,
    protected readonly mapper: AtendentMapper,
  ) {
    super(model, mapper);
  }
}
