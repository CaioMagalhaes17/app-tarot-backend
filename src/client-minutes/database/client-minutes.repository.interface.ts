import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { ClientMinutesEntity } from '../client-minutes.entity';

export interface IClientMinutesRepository
  extends BaseDomainRepository<ClientMinutesEntity> {
  findByUserId(userId: string): Promise<ClientMinutesEntity>;
}
