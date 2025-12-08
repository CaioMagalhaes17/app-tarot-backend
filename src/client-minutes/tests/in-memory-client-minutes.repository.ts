import { ClientMinutesEntity } from '../client-minutes.entity';
import { IClientMinutesRepository } from '../database/client-minutes.repository.interface';

export class InMemoryClientMinutesRepository
  implements IClientMinutesRepository {
  clientMinutes: ClientMinutesEntity[] = [];

  async create(data: ClientMinutesEntity): Promise<{ id: string }> {
    this.clientMinutes.push(data);
    return { id: data.id.toString() };
  }

  async deleteAll(): Promise<void> {
    this.clientMinutes = [];
  }

  async deleteById(id: string): Promise<void> {
    const topicIndex = this.clientMinutes.findIndex(
      (item) => item.id.toString() === id,
    );
    this.clientMinutes.splice(topicIndex, 1);
  }

  async findAll(): Promise<ClientMinutesEntity[]> {
    return this.clientMinutes;
  }

  async findByUserId(userId: string): Promise<ClientMinutesEntity> {
    const topicIndex = this.clientMinutes.findIndex(
      (item) => item.user.id.toString() === userId,
    );
    return this.clientMinutes[topicIndex];
  }

  findAllPaginated<T>(page: number, limit: number, param?: T) {}

  async findById(id: string): Promise<ClientMinutesEntity> {
    const topicIndex = this.clientMinutes.findIndex(
      (item) => item.id.toString() === id,
    );
    return this.clientMinutes[topicIndex];
  }

  async findByParam<ParamType>(
    param: Partial<ParamType>,
    paginateObj?: { page: number; limit: number },
  ): Promise<ClientMinutesEntity[]> {
    return this.clientMinutes;
  }

  async search(field: string, query: string): Promise<ClientMinutesEntity[]> {
    return this.clientMinutes;
  }

  async updateById(id: string, updateData: ClientMinutesEntity) {
    const topicIndex = this.clientMinutes.findIndex(
      (item) => item.id.toString() === id,
    );

    this.clientMinutes[topicIndex] = updateData;
  }
}
