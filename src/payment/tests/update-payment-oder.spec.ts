import { InMemoryPaymentOrderRepository } from './in-memory-payment.repository';
import { InMemoryPaymentGateway } from 'src/gateways/payment/tests/in-memory-payment-gateway';
import { UpdatePaymentOrderUseCase } from '../use-cases/update-payment-order';
import { PaymentOrderNotFound } from '../error/PaymentOrderNotFound';
import { makePaymentOrder } from './makePaymentOrder';

let inMemoryPaymentOrderRepository: InMemoryPaymentOrderRepository;
let inMemoryPaymentGateway: InMemoryPaymentGateway;
let sut: UpdatePaymentOrderUseCase;

describe('UpdatePaymentOrder', () => {
  beforeEach(() => {
    inMemoryPaymentOrderRepository = new InMemoryPaymentOrderRepository();
    inMemoryPaymentGateway = new InMemoryPaymentGateway();
    sut = new UpdatePaymentOrderUseCase(
      inMemoryPaymentOrderRepository,
      inMemoryPaymentGateway,
    );
  });

  it('Should not update payment order if gateway order is not found', async () => {
    const response = await sut.execute('asd');

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(Error);
  });

  it('Should not update payment order if db order is not found', async () => {
    inMemoryPaymentGateway.createPaymentOrder('USERID', 10);
    const response = await sut.execute(
      inMemoryPaymentGateway.paymentOrders[0].externalId,
    );

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(PaymentOrderNotFound);
  });

  it('Should update payment order', async () => {
    inMemoryPaymentGateway.createPaymentOrder('USERID', 10);
    inMemoryPaymentOrderRepository.create(
      makePaymentOrder({
        externalId: inMemoryPaymentGateway.paymentOrders[0].externalId,
      }),
    );
    expect(inMemoryPaymentOrderRepository.paymentOrders[0].status).toBe(
      'pending',
    );
    inMemoryPaymentGateway.paymentOrders[0].status = 'completed';

    const response = await sut.execute(
      inMemoryPaymentGateway.paymentOrders[0].externalId,
    );

    expect(inMemoryPaymentOrderRepository.paymentOrders[0].status).toBe(
      'completed',
    );
    expect(
      inMemoryPaymentOrderRepository.paymentOrders[0].updatedAt,
    ).toBeInstanceOf(Date);
    expect(response.isRight()).toBe(true);
  });
});
