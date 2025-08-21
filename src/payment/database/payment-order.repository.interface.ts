import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { PaymentOrderEntity } from '../payment-order.entity';

export interface IPaymentOrderRepository
  extends BaseDomainRepository<PaymentOrderEntity> {
  findOrdersByUserId(userId: string): Promise<PaymentOrderEntity[]>;
  findByExternalId(externalId: string): Promise<PaymentOrderEntity | null>;
}
