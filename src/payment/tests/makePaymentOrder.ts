import { makeUser } from 'src/user/tests/makeUser';
import {
  PaymentOrderEntity,
  PaymentOrderEntityProps,
} from '../payment-order.entity';

export function makePaymentOrder(
  override?: Partial<PaymentOrderEntityProps>,
  id?: string,
) {
  const data: PaymentOrderEntityProps = {
    amount: 10,
    description: 'Compra de minutos',
    userId: 'userId',
    productType: 'minutes',
    createdAt: new Date(),
    status: 'pending',
    type: 'payment',
    ...override,
  };

  return PaymentOrderEntity.create(data, id || 'ORDER_ID');
}
