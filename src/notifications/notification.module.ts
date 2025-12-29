import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationDatabaseModule } from './database/notification.database.module';
import { CreateNotificationUseCase } from './use-cases/create-notification';
import { FetchNotificationsByUserUseCase } from './use-cases/fetch-notifications-by-user';
import { MarkNotificationAsReadUseCase } from './use-cases/mark-notification-as-read';
import { MarkAllNotificationsAsReadUseCase } from './use-cases/mark-all-notifications-as-read';
import { PaymentApprovedListener } from './listeners/payment-approved.listener';

@Module({
  imports: [NotificationDatabaseModule],
  controllers: [NotificationController],
  providers: [
    CreateNotificationUseCase,
    FetchNotificationsByUserUseCase,
    MarkNotificationAsReadUseCase,
    MarkAllNotificationsAsReadUseCase,
    PaymentApprovedListener,
  ],
  exports: [CreateNotificationUseCase, NotificationDatabaseModule],
})
export class NotificationModule {}
