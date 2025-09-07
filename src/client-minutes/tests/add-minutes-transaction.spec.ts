import { InMemoryClientMinutesRepository } from './in-memory-client-minutes.repository';
import { AddMinutesTransactionUseCase } from '../use-cases/add-minutes-transaction';
import { makePaymentOrder } from 'src/payment/tests/makePaymentOrder';
import {
  makeClientMinutes,
  makeClientMinutesTransaction,
} from './makeClientMinutes';

let inMemoryClientMinutesRepository: InMemoryClientMinutesRepository;
let sut: AddMinutesTransactionUseCase;

describe('AddPurchaseMinutes', () => {
  beforeEach(() => {
    inMemoryClientMinutesRepository = new InMemoryClientMinutesRepository();
    sut = new AddMinutesTransactionUseCase(inMemoryClientMinutesRepository);
  });

  it('should work', async () => {
    const paymentOrder = makePaymentOrder({}, 'order_id');
    const clientMinutes = makeClientMinutes({});
    clientMinutes.createTransaction(
      makeClientMinutesTransaction({ paymentOrder }),
    );
    inMemoryClientMinutesRepository.create(clientMinutes);

    const response = await sut.execute(paymentOrder);
    expect(response.isRight()).toBe(true);
    expect(inMemoryClientMinutesRepository.clientMinutes[0].totalMinutes).toBe(
      10,
    );
  });
});
