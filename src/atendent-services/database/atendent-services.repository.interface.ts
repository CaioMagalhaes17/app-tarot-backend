import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { AtendentServicesEntity } from '../atendent-services.entity';

export interface IAtendentServicesRepository
  extends BaseDomainRepository<AtendentServicesEntity> {}
