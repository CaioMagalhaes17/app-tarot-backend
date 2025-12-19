import { Module, forwardRef } from '@nestjs/common';
import { PaymentGateway } from './payment/payment-gateway';
import { MercadoPagoGateway } from './payment/mercado-pago-gateway';
import { EventGateway } from './events/event.gateway';
import { PaymentIntentCreatedListener } from './events/listeners/payment-created';
import { InfraEventEmitter } from './events/event-emmiter.gateway';
import { PaymentOrderSucceedListener } from './events/listeners/payment-order-succeed';
import { PaymentOrderCompletedFactory } from './payment/factories/payment-order-completed-factory';
// ClientMinutesModule removed - module is no longer used
// import { AddMinutesTransactionUseCase } from 'src/client-minutes/use-cases/events/add-minutes-transaction';
// import { ClientMinutesModule } from 'src/client-minutes/client-minutes.module';
import { PaymentOrderFailedFactory } from './payment/factories/payment-order-failed-factory';
// import { FailedMinutesTransactionUseCase } from 'src/client-minutes/use-cases/events/failed-minutes-transaction';
import { PaymentOrderFailedListener } from './events/listeners/payment-order-failed';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { ProcessAppointmentPaymentUseCase } from 'src/appointment/use-cases/process-appointment-payment';

@Module({
  // ClientMinutesModule removed - module is no longer used
  imports: [forwardRef(() => AppointmentModule)],
  providers: [
    {
      provide: PaymentGateway,
      useClass: MercadoPagoGateway, // Trocado de StripeGateway para MercadoPagoGateway
    },
    {
      provide: EventGateway,
      useClass: InfraEventEmitter,
    },
    {
      provide: PaymentOrderCompletedFactory,
      useFactory: (
        processAppointmentPaymentUseCase?: ProcessAppointmentPaymentUseCase,
      ) => {
        // ClientMinutesModule removed - no longer injecting AddMinutesTransactionUseCase
        return new PaymentOrderCompletedFactory(
          null,
          processAppointmentPaymentUseCase,
        );
      },
      inject: [ProcessAppointmentPaymentUseCase],
    },
    {
      provide: PaymentOrderFailedFactory,
      useFactory: () => {
        // ClientMinutesModule removed - no longer injecting FailedMinutesTransactionUseCase
        return new PaymentOrderFailedFactory(null);
      },
      inject: [],
    },
    PaymentIntentCreatedListener,
    PaymentOrderSucceedListener,
    PaymentOrderFailedListener,
  ],
  exports: [PaymentGateway, EventGateway],
})
export class GatewaysModule {}
