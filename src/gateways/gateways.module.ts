import { Module } from '@nestjs/common';
import { PaymentGateway } from './payment/payment-gateway';
import { StripeGateway } from './payment/stripe-gateway';
import { EventGateway } from './events/event.gateway';
import { PaymentIntentCreatedListener } from './events/listeners/payment-created';
import { InfraEventEmitter } from './events/event-emmiter.gateway';
import { PaymentOrderSucceedListener } from './events/listeners/payment-order-succeed';
import { PaymentOrderCompletedFactory } from './payment/factories/payment-order-completed-factory';
import { AddMinutesTransactionUseCase } from 'src/client-minutes/use-cases/events/add-minutes-transaction';
import { ClientMinutesModule } from 'src/client-minutes/client-minutes.module';
import { PaymentOrderFailedFactory } from './payment/factories/payment-order-failed-factory';
import { FailedMinutesTransactionUseCase } from 'src/client-minutes/use-cases/events/failed-minutes-transaction';
import { PaymentOrderFailedListener } from './events/listeners/payment-order-failed';

@Module({
  imports: [ClientMinutesModule],
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripeGateway,
    },
    {
      provide: EventGateway,
      useClass: InfraEventEmitter,
    },
    {
      provide: PaymentOrderCompletedFactory,
      useFactory: (
        addMinutesTransactionUseCase: AddMinutesTransactionUseCase,
      ) => {
        return new PaymentOrderCompletedFactory(addMinutesTransactionUseCase);
      },
      inject: [AddMinutesTransactionUseCase],
    },
    {
      provide: PaymentOrderFailedFactory,
      useFactory: (
        failedMinutesTransactionUseCase: FailedMinutesTransactionUseCase,
      ) => {
        return new PaymentOrderFailedFactory(failedMinutesTransactionUseCase);
      },
      inject: [FailedMinutesTransactionUseCase],
    },
    PaymentIntentCreatedListener,
    PaymentOrderSucceedListener,
    PaymentOrderFailedListener,
  ],
  exports: [PaymentGateway, EventGateway],
})
export class GatewaysModule {}
