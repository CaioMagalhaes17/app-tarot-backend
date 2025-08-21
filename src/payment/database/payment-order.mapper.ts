import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { PaymentOrder } from './payment-order.schema';
import { PaymentOrderEntity } from '../payment-order.entity';
import { Types } from 'mongoose';

export class PaymentOrderMapper
  implements BaseMapperInterface<PaymentOrder, PaymentOrderEntity> {
  toDomain(row: PaymentOrder): PaymentOrderEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    return PaymentOrderEntity.create(
      {
        ...rest,
        user: row.userId,
      },
      _id,
    );
  }

  toDomainArray(rows: PaymentOrder[]): PaymentOrderEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: PaymentOrderEntity) {
    return {
      userId: new Types.ObjectId(domain.user.id.toString()),
      type: domain.type,
      amount: domain.amount,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      externalId: domain.externalId,
      paymentMethod: domain.paymentMethod,
      withdrawlMethod: domain.withdrawlMethod,
      errorDescription: domain.errorDescription,
    };
  }
}
