import { InMemoryUserRepository } from 'src/user/tests/in-memory-user.repository';
import { CreatePaymentOrderUseCase } from '../use-cases/create-payment-order';
import { InMemoryPaymentOrderRepository } from './in-memory-payment.repository';
import { InMemoryPaymentGateway } from 'src/gateways/payment/tests/in-memory-payment-gateway';
import { UserNotFound } from 'src/user/errors/UserNotFound';
import { makeUser } from 'src/user/tests/makeUser';

let inMemoryPaymentOrderRepository: InMemoryPaymentOrderRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryPaymentGateway: InMemoryPaymentGateway;
let sut: CreatePaymentOrderUseCase;

describe('CreatePaymentOrder', () => {
  beforeEach(() => {
    inMemoryPaymentOrderRepository = new InMemoryPaymentOrderRepository();
    inMemoryPaymentGateway = new InMemoryPaymentGateway();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new CreatePaymentOrderUseCase(
      inMemoryPaymentOrderRepository,
      inMemoryPaymentGateway,
      inMemoryUserRepository,
    );
  });

  it('Should not create payment order if user not found', async () => {
    const response = await sut.execute({
      amount: 29,
      description: 'Compra de minutos',
      paymentMethod: 'PIX',
      userId: '123',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFound);
  });

  it('Should not create payment order if payment gateway returns error', async () => {
    inMemoryUserRepository.create(makeUser({}, 'USER_ID'));
    const response = await sut.execute({
      amount: 2,
      description: 'Compra de minutos',
      paymentMethod: 'PIX',
      userId: 'USER_ID',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(Error);
    if (response.isLeft()) {
      expect(response.value.message.includes('Erro no gateway:')).toBe(true);
    }
  });

  it('Should not create payment order if payment gateway returns error', async () => {
    inMemoryUserRepository.create(makeUser({}, 'USER_ID'));
    const response = await sut.execute({
      amount: 2,
      description: 'Compra de minutos',
      paymentMethod: 'PIX',
      userId: 'USER_ID',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(Error);
    if (response.isLeft()) {
      expect(response.value.message.includes('Erro no gateway:')).toBe(true);
    }
  });

  it('Should not create payment order if payment gateway returns error', async () => {
    inMemoryUserRepository.create(makeUser({}, 'USER_ID'));
    const response = await sut.execute({
      amount: 10,
      description: 'Compra de minutos',
      paymentMethod: 'PIX',
      userId: 'USER_ID',
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryPaymentOrderRepository.paymentOrders.length).toBe(1);
    expect(inMemoryPaymentOrderRepository.paymentOrders[0].status).toBe(
      'pending',
    );
  });
});
