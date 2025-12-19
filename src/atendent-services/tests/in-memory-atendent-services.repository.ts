import { IAtendentServicesRepository } from '../database/atendent-services.repository.interface';
import { AtendentServicesEntity } from '../atendent-services.entity';

export class InMemoryAtendentServicesRepository
  implements IAtendentServicesRepository
{
  atendentServices: AtendentServicesEntity[] = [];

  async create(data: AtendentServicesEntity): Promise<{ id: string }> {
    this.atendentServices.push(data);
    return { id: data.id.toString() };
  }

  async findAll(): Promise<AtendentServicesEntity[]> {
    return this.atendentServices;
  }

  async findById(id: string): Promise<AtendentServicesEntity | null> {
    const service = this.atendentServices.find(
      (item) => item.id.toString() === id,
    );
    return service || null;
  }

  async findAllAtendentServicesByAtendentId(
    atendentId: string,
  ): Promise<AtendentServicesEntity[]> {
    return this.atendentServices.filter(
      (service) => service.atendent.id.toString() === atendentId,
    );
  }

  async findAtendentServiceByServiceId(
    serviceId: string,
  ): Promise<AtendentServicesEntity | null> {
    const service = this.atendentServices.find(
      (item) => item.service.id.toString() === serviceId,
    );
    return service || null;
  }

  async updateById(
    id: string,
    updateData: AtendentServicesEntity,
  ): Promise<void> {
    const index = this.atendentServices.findIndex(
      (item) => item.id.toString() === id,
    );
    if (index !== -1) {
      this.atendentServices[index] = updateData;
    }
  }

  async deleteById(id: string): Promise<void> {
    const index = this.atendentServices.findIndex(
      (item) => item.id.toString() === id,
    );
    if (index !== -1) {
      this.atendentServices.splice(index, 1);
    }
  }

  async deleteAll(): Promise<void> {
    this.atendentServices = [];
  }

  async findByParam<ParamType>(
    param: Partial<ParamType>,
    paginateObj?: { page: number; limit: number },
  ): Promise<AtendentServicesEntity[]> {
    return this.atendentServices;
  }

  async search(
    field: string,
    query: string,
  ): Promise<AtendentServicesEntity[]> {
    return this.atendentServices;
  }

  async findAllPaginated<T>(
    page: number,
    limit: number,
    param?: T,
  ): Promise<{
    data: AtendentServicesEntity[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const data = this.atendentServices.slice(skip, skip + limit);
    const total = this.atendentServices.length;

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}

