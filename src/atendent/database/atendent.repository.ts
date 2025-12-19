import { BaseInfraRepository } from 'src/core/base.repository';
import { Model, Types } from 'mongoose';
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

  async findByUserId(userId: string) {
    const atendent = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .populate('userId')
      .exec();

    if (atendent.length === 0) return null;
    return this.mapper.toDomain(atendent[0]);
  }

  async findById(id: string) {
    const atendent = this.mapper.toDomain(
      await this.model
        .findById(new Types.ObjectId(id))
        .populate('userId')
        .exec(),
    );

    return atendent;
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
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model
        .find(
          search && {
            name: { $regex: search, $options: 'i' },
          },
        )
        .skip(skip)
        .limit(limit)
        .populate('userId')
        .exec(),
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
