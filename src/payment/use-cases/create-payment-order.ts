import { PaymentGateway } from 'src/gateways/payment/payment-gateway';
import { IPaymentOrderRepository } from '../database/payment-order.repository.interface';
import { PaymentOrderEntity } from '../payment-order.entity';
import { Either, left, right } from 'src/core/Either';
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { UserNotFound } from 'src/user/errors/UserNotFound';

export class CreatePaymentOrderUseCase {
  constructor(
    private paymentOrderRepository: IPaymentOrderRepository,
    private paymentGateway: PaymentGateway,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    amount,
    description,
    paymentMethod,
    userId,
  }: {
    userId: string;
    amount: number;
    description: string;
    paymentMethod: string;
  }): Promise<
    Either<Error | UserNotFound, { id: string; externalId: string }>
  > {
    const user = await this.userRepository.findById(userId);
    if (!user) return left(new UserNotFound());
    const gatewayResponse = await this.paymentGateway.createPaymentOrder(
      userId,
      amount,
    );
    if (gatewayResponse.isLeft()) {
      return left(
        new Error('Erro no gateway: ' + gatewayResponse.value.message),
      );
    }
    const paymentOrder = PaymentOrderEntity.create({
      amount,
      createdAt: new Date(),
      status: gatewayResponse.value.status,
      type: 'payment',
      description,
      paymentMethod,
      user,
      externalId: gatewayResponse.value.externalId,
    });

    return right({
      id: (await this.paymentOrderRepository.create(paymentOrder)).id,
      externalId: gatewayResponse.value.externalId,
    });
  }
}
