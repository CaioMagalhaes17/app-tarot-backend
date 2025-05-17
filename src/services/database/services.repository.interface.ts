import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { ServicesEntity } from '../services.entity';

export interface IServicesRepository
  extends BaseDomainRepository<ServicesEntity> {}
