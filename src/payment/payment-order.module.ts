import { Module } from '@nestjs/common';
import { PaymentOrderDatabaseModule } from './database/payment-oder.module';
import { PaymentOrderController } from './payment-oder.controller';
import { CreatePaymentOrderUseCase } from './use-cases/create-payment-order';
import { IPaymentOrderRepository } from './database/payment-order.repository.interface';
import { PaymentOrderRepository } from './database/payment-order.repository';
import { UserDatabaseModule } from 'src/user/database/user.database.module';
import { UserRepository } from 'src/user/database/user.repository';
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { GatewaysModule } from 'src/gateways/gateways.module';
import { PaymentGateway } from 'src/gateways/payment/payment-gateway';
import { PaymentIntentSucceededUseCase } from './use-cases/payment-intent-order-succeeded';
import { UpdatePaymentOrderUseCase } from './use-cases/update-payment-order';

@Module({
  imports: [PaymentOrderDatabaseModule, UserDatabaseModule, GatewaysModule],
  controllers: [PaymentOrderController],
  providers: [
    {
      provide: CreatePaymentOrderUseCase,
      useFactory: (
        paymentOrderRepository: IPaymentOrderRepository,
        paymentGateway: PaymentGateway,
        userRepository: IUserRepository,
      ) => {
        return new CreatePaymentOrderUseCase(
          paymentOrderRepository,
          paymentGateway,
          userRepository,
        );
      },
      inject: [PaymentOrderRepository, PaymentGateway, UserRepository],
    },
    {
      provide: UpdatePaymentOrderUseCase,
      useFactory: (
        paymentOrderRepository: IPaymentOrderRepository,
        paymentGateway: PaymentGateway,
      ) => {
        return new UpdatePaymentOrderUseCase(
          paymentOrderRepository,
          paymentGateway,
        );
      },
      inject: [PaymentOrderRepository, PaymentGateway],
    },
    {
      provide: PaymentIntentSucceededUseCase,
      useFactory: (
        paymentOrderRepository: IPaymentOrderRepository,
        paymentGateway: PaymentGateway,
      ) => {
        return new PaymentIntentSucceededUseCase(
          paymentOrderRepository,
          paymentGateway,
        );
      },
      inject: [PaymentOrderRepository, PaymentGateway],
    },
  ],
  exports: [PaymentIntentSucceededUseCase],
})
export class PaymentOrderModule {}
