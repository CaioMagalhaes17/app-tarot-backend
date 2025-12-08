import { BaseInfraRepository } from 'src/core/base.repository';
import { Model, Types } from 'mongoose';
import { AtendentServicesEntity } from '../atendent-services.entity';
import { AtendentServices } from './atendent-services.schema';
import { AtendentServicesMapper } from './atendent-services.mapper';

export class AtendentServicesRepository extends BaseInfraRepository<
  AtendentServices,
  AtendentServicesEntity
> {
  constructor(
    protected readonly model: Model<AtendentServices>,
    protected readonly mapper: AtendentServicesMapper,
  ) {
    super(model, mapper);
  }

  async findById(id: string) {
    const result = await this.model
      .findById(new Types.ObjectId(id))
      .populate([
        'serviceId',
        {
          path: 'atendentId',
          populate: {
            path: 'userId',
          },
        },
      ])
      .exec();
    return this.mapper.toDomain(result);
  }

  async findAllAtendentServicesByAtendentId(atendentId: string) {
    const result = await this.model
      .find({
        atendentId: new Types.ObjectId(atendentId),
      })
      .populate([
        'serviceId',
        {
          path: 'atendentId',
          populate: {
            path: 'userId',
          },
        },
      ])
      .exec();
    return this.mapper.toDomainArray(result);
  }

  async findAtendentServiceByServiceId(serviceId: string) {
    const result = await this.model
      .findOne({
        serviceId: new Types.ObjectId(serviceId),
      })
      .populate([
        'serviceId',
        {
          path: 'atendentId',
          populate: {
            path: 'userId',
          },
        },
      ])
      .exec();
    if (!result) return null;
    return this.mapper.toDomain(result);
  }
}
