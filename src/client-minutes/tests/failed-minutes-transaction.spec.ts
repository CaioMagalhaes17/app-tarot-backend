import { InMemoryClientMinutesRepository } from './in-memory-client-minutes.repository';
import { makePaymentOrder } from 'src/payment/tests/makePaymentOrder';
import {
  makeClientMinutes,
  makeClientMinutesTransaction,
} from './makeClientMinutes';
import { FailedMinutesTransactionUseCase } from '../use-cases/events/failed-minutes-transaction';
import { makeUser } from 'src/user/tests/makeUser';

let inMemoryClientMinutesRepository: InMemoryClientMinutesRepository;
let sut: FailedMinutesTransactionUseCase;

describe('FailedPurchaseMinutes', () => {
  beforeEach(() => {
    inMemoryClientMinutesRepository = new InMemoryClientMinutesRepository();
    sut = new FailedMinutesTransactionUseCase(inMemoryClientMinutesRepository);
  });

  it('should work', async () => {
    const paymentOrder = makePaymentOrder(
      {
        errorDescription: 'Cartão recusado',
        userId: 'user_id',
      },
      'order_id',
    );
    const clientMinutes = makeClientMinutes({
      user: makeUser({}, 'user_id'),
    });
    clientMinutes.createTransaction(
      makeClientMinutesTransaction({ paymentOrder }),
    );
    inMemoryClientMinutesRepository.create(clientMinutes);
    const response = await sut.execute(paymentOrder);
    expect(response.isRight()).toBe(true);
    expect(
      inMemoryClientMinutesRepository.clientMinutes[0].transactions[0]
        .description,
    ).toBeDefined();
  });
});
