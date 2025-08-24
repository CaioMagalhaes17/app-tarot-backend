import { PaymentGateway } from 'src/gateways/payment/payment-gateway';
import { IPaymentOrderRepository } from '../database/payment-order.repository.interface';
import { PaymentOrderEntity, ProductType } from '../payment-order.entity';
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
    userId,
    productType,
  }: {
    userId: string;
    amount: number;
    description: string;
    productType: ProductType;
  }): Promise<
    Either<
      Error | UserNotFound,
      { id: string; externalId: string; clientSecret: string }
    >
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
      user,
      productType,
      externalId: gatewayResponse.value.externalId,
    });

    const response = await this.paymentOrderRepository.create(paymentOrder);
    return right({
      id: response.id,
      externalId: gatewayResponse.value.externalId,
      clientSecret: gatewayResponse.value.clientSecret,
    });
  }
}
