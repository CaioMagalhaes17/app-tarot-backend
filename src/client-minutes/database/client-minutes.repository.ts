import { BaseInfraRepository } from 'src/core/base.repository';
import { Model, Types } from 'mongoose';
import { ClientMinutes } from './client-minutes.schema';
import { ClientMinutesEntity } from '../client-minutes.entity';
import { ClientMinutesMapper } from './client-minutes.mapper';

export class ClientMinutesRepository extends BaseInfraRepository<
  ClientMinutes,
  ClientMinutesEntity
> {
  constructor(
    protected readonly model: Model<ClientMinutes>,
    protected readonly mapper: ClientMinutesMapper,
  ) {
    super(model, mapper);
  }

  async findAll(): Promise<ClientMinutesEntity[]> {
    return this.mapper.toDomainArray(
      await this.model
        .find()
        .populate(['userId', 'transactions.paymentOrder'])
        .lean()
        .exec(),
    );
  }

  async findById(id: string): Promise<ClientMinutesEntity | null> {
    const firstTry = await this.model
      .findById(new Types.ObjectId(id))
      .populate(['userId', 'transactions.paymentOrder'])
      .lean()
      .exec();

    if (firstTry) {
      return this.mapper.toDomain(firstTry);
    }
    const secund = await this.model
      .findById(id)
      .populate(['userId', 'transactions.paymentOrder'])
      .lean()
      .exec();
    return this.mapper.toDomain(secund);
  }

  async findByParam<ParamType>(param: ParamType) {
    return this.mapper.toDomainArray(
      await this.model
        .find(param)
        .populate(['userId', 'transactions.paymentOrder'])
        .lean()
        .exec(),
    );
  }

  async findByUserId(userId: string) {
    const firstTry = this.mapper.toDomain(
      await this.model
        .findOne({
          userId: new Types.ObjectId(userId),
        })
        .populate(['userId', 'transactions.paymentOrder'])
        .lean()
        .exec(),
    );

    if (firstTry) return firstTry;

    const teste = this.mapper.toDomain(
      await this.model
        .findOne({
          userId,
        })
        .populate(['userId', 'transactions.paymentOrder'])
        .lean()
        .exec(),
    );
    return teste;
  }

  async updateById(id: string, updateData: ClientMinutesEntity) {
    await this.model.findByIdAndUpdate(
      id,
      this.mapper.toPersistance(updateData),
    );
  }

  async create(data: ClientMinutesEntity): Promise<{ id: string }> {
    const existing = await this.model
      .findOne({
        userId: data.user.id.toString(),
      })
      .populate(['userId', 'transactions.paymentOrder'])
      .lean()
      .exec();
    if (existing) {
      return { id: existing.id };
    }
    return {
      id: (await this.model.create(this.mapper.toPersistance(data))).id,
    };
  }
}
