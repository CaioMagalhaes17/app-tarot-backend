import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { UserEntity } from '../user.entity';

export interface IUserRepository extends BaseDomainRepository<UserEntity> {}
