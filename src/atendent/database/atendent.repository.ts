import { BaseInfraRepository } from 'src/core/base.repository';
import { Model } from 'mongoose';
import { Atendent } from './atendent.schema';
import { AtendentEntity } from '../atendent.entity';
import { AtendentMapper } from './atendent.mapper';

export class AtendentRepository extends BaseInfraRepository<
  Atendent,
  AtendentEntity
> {
  constructor(
    protected readonly model: Model<Atendent>,
    protected readonly mapper: AtendentMapper,
  ) {
    super(model, mapper);
  }

  async findAll(): Promise<AtendentEntity[]> {
    return this.mapper.toDomainArray(await this.model.find().exec());
  }

  async findAllPaginated<T = unknown>(page: number, limit: number, param?: T) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(param).skip(skip).limit(limit).populate('userId').exec(),
      this.model.countDocuments().exec(),
    ]);

    return {
      data: this.mapper.toDomainArray(data),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
