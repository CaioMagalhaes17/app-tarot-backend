import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { AtendentServicesEntity } from '../atendent-services.entity';

export interface IAtendentServicesRepository
  extends BaseDomainRepository<AtendentServicesEntity> {
  findAllAtendentServicesByAtendentId(
    atendentId: string,
  ): Promise<AtendentServicesEntity[]>;
  findAtendentServiceByServiceId(
    serviceId: string,
  ): Promise<AtendentServicesEntity | null>;
}
