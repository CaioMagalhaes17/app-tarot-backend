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
import { PaymentIntentSucceededUseCase } from './use-cases/events/payment-intent-order-succeeded';
import { UpdatePaymentOrderUseCase } from './use-cases/update-payment-order';
import { EventGateway } from 'src/gateways/events/event.gateway';
import { PaymentIntentOrderFailedUseCase } from './use-cases/events/payment-intent-order-failed';
import { PaymentFailedMessageFactory } from './factories/payment-failed-message.factory';

@Module({
  imports: [PaymentOrderDatabaseModule, UserDatabaseModule, GatewaysModule],
  controllers: [PaymentOrderController],
  providers: [
    PaymentFailedMessageFactory,
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
        eventGateway: EventGateway,
      ) => {
        return new PaymentIntentSucceededUseCase(
          paymentOrderRepository,
          eventGateway,
        );
      },
      inject: [PaymentOrderRepository, EventGateway],
    },
    {
      provide: PaymentIntentOrderFailedUseCase,
      useFactory: (
        paymentOrderRepository: IPaymentOrderRepository,
        paymentFailedMessageFactory: PaymentFailedMessageFactory,
        eventGateway: EventGateway,
      ) => {
        return new PaymentIntentOrderFailedUseCase(
          paymentOrderRepository,
          paymentFailedMessageFactory,
          eventGateway,
        );
      },
      inject: [
        PaymentOrderRepository,
        PaymentFailedMessageFactory,
        EventGateway,
      ],
    },
  ],
  exports: [
    PaymentIntentSucceededUseCase,
    PaymentIntentOrderFailedUseCase,
    CreatePaymentOrderUseCase,
  ],
})
export class PaymentOrderModule {}
