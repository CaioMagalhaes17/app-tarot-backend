import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { UserEntity } from '../user.entity';

export interface IUserRepository extends BaseDomainRepository<UserEntity> {
  findByGoogleId(googleId: string): Promise<UserEntity | null>;
  fetchUserByLogin(login: string): Promise<UserEntity | null>;
  updateById(id: string, updateData: Partial<UserEntity>): Promise<void>;
}
