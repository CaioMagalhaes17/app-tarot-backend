import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { SpecialitiesEntity } from '../specialities.entity';

export interface ISpecialitiesRepository
  extends BaseDomainRepository<SpecialitiesEntity> {}
