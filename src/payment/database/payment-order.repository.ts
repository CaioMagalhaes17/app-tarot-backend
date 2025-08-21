import { BaseInfraRepository } from 'src/core/base.repository';
import { Model } from 'mongoose';
import { PaymentOrder } from './payment-order.schema';
import { PaymentOrderEntity } from '../payment-order.entity';
import { PaymentOrderMapper } from './payment-order.mapper';
import { IPaymentOrderRepository } from './payment-order.repository.interface';

export class PaymentOrderRepository
  extends BaseInfraRepository<PaymentOrder, PaymentOrderEntity>
  implements IPaymentOrderRepository {
  constructor(
    protected readonly model: Model<PaymentOrder>,
    protected readonly mapper: PaymentOrderMapper,
  ) {
    super(model, mapper);
  }

  async findByExternalId(
    externalId: string,
  ): Promise<PaymentOrderEntity | null> {
    const result = await this.model
      .findOne({ externalId })
      .populate('userId')
      .exec();
    if (!result) return null;
    return this.mapper.toDomain(result);
  }

  async findAll(): Promise<PaymentOrderEntity[]> {
    return this.mapper.toDomainArray(
      await this.model.find().populate('userId').exec(),
    );
  }

  async findByParam<ParamType>(param: ParamType) {
    return this.mapper.toDomainArray(
      await this.model.find(param).populate('userId').exec(),
    );
  }

  async findOrdersByUserId(userId: string) {
    return this.mapper.toDomainArray(
      await this.model
        .find({
          userId,
        })
        .populate('userId')
        .exec(),
    );
  }

  async create(data: PaymentOrderEntity): Promise<{ id: string }> {
    const dataToInsert = this.mapper.toPersistance(data);
    const result = await this.model.create(dataToInsert);
    return result.id;
  }
}
