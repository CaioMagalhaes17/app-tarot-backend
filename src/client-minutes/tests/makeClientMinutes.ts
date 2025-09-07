import { makeUser } from 'src/user/tests/makeUser';
import {
  ClientMinutesEntity,
  ClientMinutesProps,
  MinutesTransaction,
} from '../client-minutes.entity';
import { makePaymentOrder } from 'src/payment/tests/makePaymentOrder';

export function makeClientMinutes(
  override?: Partial<ClientMinutesProps>,
  id?: string,
) {
  const data: ClientMinutesProps = {
    avaliableMinutes: 0,
    totalMinutes: 0,
    transactions: [],
    createdAt: new Date(),
    user: makeUser(),
    ...override,
  };

  return ClientMinutesEntity.create(data, id || 'ORDER_ID');
}

export function makeClientMinutesTransaction(
  override?: Partial<MinutesTransaction>,
) {
  const data: MinutesTransaction = {
    date: new Date(),
    minutes: 10,
    paymentOrder: makePaymentOrder(),
    status: 'pending',
    type: 'purchase',
    description: '',
    ...override,
  };

  return data;
}
