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
      await this.model.find().populate('userId').exec(),
    );
  }

  async findByParam<ParamType>(param: ParamType) {
    return this.mapper.toDomainArray(
      await this.model.find(param).populate('userId').exec(),
    );
  }

  async findByUserId(userId: string) {
    const firstTry = this.mapper.toDomain(
      await this.model
        .findOne({
          userId: new Types.ObjectId(userId),
        })
        .populate('userId')
        .exec(),
    );
    if (firstTry) return firstTry;
    return this.mapper.toDomain(
      await this.model
        .findOne({
          userId,
        })
        .populate('userId')
        .exec(),
    );
  }

  async updateById(
    id: string,
    updateData: ClientMinutesEntity,
  ): Promise<ClientMinutesEntity> {
    await this.model.findByIdAndUpdate(
      id,
      this.mapper.toPersistance(updateData),
    );
    return this.mapper.toDomain(await this.model.findById(id).exec());
  }

  async create(data: ClientMinutesEntity): Promise<{ id: string }> {
    const existing = await this.model
      .find({
        userId: data.user.id.toString(),
      })
      .populate('userId')
      .exec();
    if (existing) {
      console.log('niggers');
      return;
    }
    return {
      id: (await this.model.create(this.mapper.toPersistance(data))).id,
    };
  }
}
