import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from './infra/infra.module';
import { UserModule } from './user/user.module';
import { MongoModule } from './infra/database/mongo.module';
import { EmailModule } from './email/email.module';
import { ServicesModule } from './services/services.module';
import { AtendentModule } from './atendent/atendent.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
// ClientMinutesModule removed - module is no longer used
// import { ClientMinutesModule } from './client-minutes/client-minutes.module';
// ProductModule removed - module is no longer used
// import { ProductModule } from './products/product.module';
import { PaymentOrderModule } from './payment/payment-order.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { GatewaysModule } from './gateways/gateways.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppointmentModule } from './appointment/appointment.module';
import { AtendentServicesModule } from './atendent-services/atendent-services.module';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({}),
    GatewaysModule,
    // ProductModule removed - module is no longer used
    InfraModule,
    UserModule,
    MongoModule,
    EmailModule,
    ServicesModule,
    AtendentModule,
    FeedbacksModule,
    // ClientMinutesModule removed - module is no longer used
    PaymentOrderModule,
    WebhooksModule,
    AppointmentModule,
    AtendentServicesModule,
    NotificationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
