import { InMemoryUserRepository } from 'src/user/tests/in-memory-user.repository';
import { InMemoryClientMinutesRepository } from './in-memory-client-minutes.repository';
import { UserNotFound } from 'src/user/errors/UserNotFound';
import { CreateMinutesTransaction } from '../use-cases/create-minutes-transaction';
import { InMemoryPaymentOrderRepository } from 'src/payment/tests/in-memory-payment.repository';
import { makeUser } from 'src/user/tests/makeUser';
import { PaymentOrderNotFound } from 'src/payment/error/PaymentOrderNotFound';
import { makePaymentOrder } from 'src/payment/tests/makePaymentOrder';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryClientMinutesRepository: InMemoryClientMinutesRepository;
let inMemoryPaymentOrder: InMemoryPaymentOrderRepository;

let sut: CreateMinutesTransaction;

describe('AddPurchaseMinutes', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryClientMinutesRepository = new InMemoryClientMinutesRepository();
    inMemoryPaymentOrder = new InMemoryPaymentOrderRepository();
    sut = new CreateMinutesTransaction(
      inMemoryClientMinutesRepository,
      inMemoryUserRepository,
      inMemoryPaymentOrder,
    );
  });

  it('não deve criar uma transação em um usuário não existente', async () => {
    const response = await sut.execute('NON_EXISTING', 10, 'NON_EXISTING');
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFound);
  });

  it('não deve criar uma transação sem uma ordem de pagamento', async () => {
    inMemoryUserRepository.create(makeUser({}, 'USER_ID'));
    const response = await sut.execute('USER_ID', 10, 'NON_EXISTING');
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(PaymentOrderNotFound);
  });

  it('Deve criar uma transação', async () => {
    const user = makeUser({}, 'USER_ID');
    inMemoryUserRepository.create(user);
    inMemoryPaymentOrder.create(makePaymentOrder({ user }, 'PAYMENT_ORDER_ID'));
    const response = await sut.execute('USER_ID', 10, 'PAYMENT_ORDER_ID');
    expect(
      inMemoryClientMinutesRepository.clientMinutes[0].transactions[0].status,
    ).toBe('pending');
    expect(response.isRight()).toBe(true);
  });
});
