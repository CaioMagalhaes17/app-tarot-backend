import { BaseInfraRepository } from 'src/core/base.repository';
import { Model } from 'mongoose';
import { AtendentServicesEntity } from '../atendent-services.entity';
import { AtendentServices } from './atendent-services.schema';
import { AtendentServicesMapper } from './atendent-services.mapper';

export class AtendentServicesRepository extends BaseInfraRepository<
  AtendentServices,
  AtendentServicesEntity
> {
  constructor(
    protected readonly model: Model<AtendentServices>,
    protected readonly mapper: AtendentServicesMapper,
  ) {
    super(model, mapper);
  }
}
