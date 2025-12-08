import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from './infra/infra.module';
import { UserModule } from './user/user.module';
import { MongoModule } from './infra/database/mongo.module';
import { EmailModule } from './email/email.module';
import { ServicesModule } from './services/services.module';
import { AtendentModule } from './atendent/atendent.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { ClientMinutesModule } from './client-minutes/client-minutes.module';
import { PaymentOrderModule } from './payment/payment-order.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { GatewaysModule } from './gateways/gateways.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductModule } from './products/product.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AtendentServicesModule } from './atendent-services/atendent-services.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({}),
    GatewaysModule,
    ProductModule,
    InfraModule,
    UserModule,
    MongoModule,
    EmailModule,
    ServicesModule,
    AtendentModule,
    FeedbacksModule,
    ClientMinutesModule,
    PaymentOrderModule,
    WebhooksModule,
    AppointmentModule,
    AtendentServicesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
