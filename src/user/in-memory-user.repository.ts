import { IUserRepository } from './database/user.repository.interface';
import { UserEntity } from './user.entity';

export class InMemoryUserRepository implements IUserRepository {
  user: UserEntity[] = [];

  async create(data: UserEntity): Promise<{ id: string }> {
    this.user.push(data);
    return { id: data.id.toString() };
  }

  async deleteAll(): Promise<void> {
    this.user = [];
  }

  async deleteById(id: string): Promise<void> {
    const topicIndex = this.user.findIndex((item) => item.id.toString() === id);
    this.user.splice(topicIndex, 1);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.user;
  }

  findAllPaginated<T>(page: number, limit: number, param?: T) {}

  async findById(id: string): Promise<UserEntity> {
    const topicIndex = this.user.findIndex((item) => item.id.toString() === id);
    return this.user[topicIndex];
  }

  async findByParam<ParamType>(
    param: Partial<ParamType>,
    paginateObj?: { page: number; limit: number },
  ): Promise<UserEntity[]> {
    return this.user;
  }

  async search(field: string, query: string): Promise<UserEntity[]> {
    return this.user;
  }

  async updateById(id: string, updateData: UserEntity): Promise<UserEntity> {
    const topicIndex = this.user.findIndex((item) => item.id.toString() === id);

    this.user[topicIndex] = updateData;
    return this.user[topicIndex];
  }
}
