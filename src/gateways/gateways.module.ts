import { Module } from '@nestjs/common';
import { PaymentGateway } from './payment/payment-gateway';
import { StripeGateway } from './payment/stripe-gateway';
import { EventGateway } from './events/event.gateway';
import { PaymentIntentCreatedListener } from './events/listeners/payment-created';
import { InfraEventEmitter } from './events/event-emmiter.gateway';
import { PaymentOrderSucceedListener } from './events/listeners/payment-order-succeed';
import { PaymentOrderCompletedFactory } from './payment/factories/payment-order-completed-factory';
import { AddMinutesTransactionUseCase } from 'src/client-minutes/use-cases/add-minutes-transaction';
import { ClientMinutesModule } from 'src/client-minutes/client-minutes.module';

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
    PaymentIntentCreatedListener,
    PaymentOrderSucceedListener,
  ],
  exports: [PaymentGateway, EventGateway],
})
export class GatewaysModule {}
