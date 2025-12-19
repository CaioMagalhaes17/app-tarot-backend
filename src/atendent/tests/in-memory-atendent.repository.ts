import { IAtendentRepository } from '../database/atendent.repository.interface';
import { AtendentEntity } from '../atendent.entity';

export class InMemoryAtendentRepository implements IAtendentRepository {
  atendents: AtendentEntity[] = [];

  async create(data: AtendentEntity): Promise<{ id: string }> {
    this.atendents.push(data);
    return { id: data.id.toString() };
  }

  async findAll(): Promise<AtendentEntity[]> {
    return this.atendents;
  }

  async findById(id: string): Promise<AtendentEntity | null> {
    const atendent = this.atendents.find(
      (item) => item.id.toString() === id,
    );
    return atendent || null;
  }

  async findByUserId(userId: string): Promise<AtendentEntity | null> {
    const atendent = this.atendents.find(
      (item) => item.user.id.toString() === userId,
    );
    return atendent || null;
  }

  async findAtendents(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: AtendentEntity[];
    total: number;
    page: number;
    pages: number;
  }> {
    let filtered = this.atendents;

    if (search) {
      filtered = this.atendents.filter((atendent) =>
        atendent.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const skip = (page - 1) * limit;
    const data = filtered.slice(skip, skip + limit);
    const total = filtered.length;

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async updateById(id: string, updateData: AtendentEntity): Promise<void> {
    const index = this.atendents.findIndex(
      (item) => item.id.toString() === id,
    );
    if (index !== -1) {
      this.atendents[index] = updateData;
    }
  }

  async deleteById(id: string): Promise<void> {
    const index = this.atendents.findIndex(
      (item) => item.id.toString() === id,
    );
    if (index !== -1) {
      this.atendents.splice(index, 1);
    }
  }

  async deleteAll(): Promise<void> {
    this.atendents = [];
  }

  async findByParam<ParamType>(
    param: Partial<ParamType>,
    paginateObj?: { page: number; limit: number },
  ): Promise<AtendentEntity[]> {
    return this.atendents;
  }

  async search(field: string, query: string): Promise<AtendentEntity[]> {
    return this.atendents.filter((atendent) =>
      atendent.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  async findAllPaginated<T>(
    page: number,
    limit: number,
    param?: T,
  ): Promise<{
    data: AtendentEntity[];
    total: number;
    page: number;
    pages: number;
  }> {
    return this.findAtendents(page, limit);
  }
}

