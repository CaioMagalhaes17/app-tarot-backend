import { BaseInfraRepository } from 'src/core/base.repository';
import { Services } from './services.schema';
import { ServicesEntity } from '../services.entity';
import { Model } from 'mongoose';
import { ServicesMapper } from './services.mapper';

export class ServicesRepository extends BaseInfraRepository<
  Services,
  ServicesEntity
> {
  constructor(
    protected readonly model: Model<Services>,
    protected readonly mapper: ServicesMapper,
  ) {
    super(model, mapper);
  }
}
