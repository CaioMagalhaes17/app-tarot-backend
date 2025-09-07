import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { PaymentOrder } from './payment-order.schema';
import { PaymentOrderEntity } from '../payment-order.entity';

export class PaymentOrderMapper
  implements BaseMapperInterface<PaymentOrder, PaymentOrderEntity> {
  toDomain(row: any): PaymentOrderEntity {
    if (!row) return;
    const { _id, ...rest } = row;
    return PaymentOrderEntity.create(
      {
        ...rest,
        userId: row.userId,
      },
      _id.toString(),
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
      userId: domain.userId,
      type: domain.type,
      amount: domain.amount,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      externalId: domain.externalId,
      paymentMethod: domain.paymentMethod,
      productType: domain.productType,
      description: domain.description,
      withdrawlMethod: domain.withdrawlMethod,
      errorDescription: domain.errorDescription,
    };
  }
}
