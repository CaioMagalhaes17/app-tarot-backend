import { Model } from 'mongoose';
import { BaseInfraRepository } from 'src/core/base.repository';
import { UserEntity } from '../user.entity';
import { User } from './user.schema';
import { UserMapper } from './user.mapper';

export class UserRepository extends BaseInfraRepository<User, UserEntity> {
  constructor(
    protected readonly model: Model<User>,
    protected readonly mapper: UserMapper,
  ) {
    super(model, mapper);
  }

  async fetchUserByLogin(login: string): Promise<UserEntity> {
    return this.mapper.toDomain(await this.model.findOne({ login }).exec());
  }
}
