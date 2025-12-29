import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationDatabaseModule } from './database/notification.database.module';
import { CreateNotificationUseCase } from './use-cases/create-notification';
import { FetchNotificationsByUserUseCase } from './use-cases/fetch-notifications-by-user';
import { MarkNotificationAsReadUseCase } from './use-cases/mark-notification-as-read';
import { MarkAllNotificationsAsReadUseCase } from './use-cases/mark-all-notifications-as-read';
import { PaymentApprovedListener } from './listeners/payment-approved.listener';
import { INotificationRepository } from './database/notification.repository.interface';
import { NotificationRepository } from './database/notification.repository';

@Module({
  imports: [NotificationDatabaseModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: CreateNotificationUseCase,
      useFactory: (
        notificationRepository: INotificationRepository,
      ) => {
        return new CreateNotificationUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: FetchNotificationsByUserUseCase,
      useFactory: (
        notificationRepository: INotificationRepository,
      ) => {
        return new FetchNotificationsByUserUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: MarkNotificationAsReadUseCase,
      useFactory: (
        notificationRepository: INotificationRepository,
      ) => {
        return new MarkNotificationAsReadUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: MarkAllNotificationsAsReadUseCase,
      useFactory: (
        notificationRepository: INotificationRepository,
      ) => {
        return new MarkAllNotificationsAsReadUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: PaymentApprovedListener,
      useFactory: (createNotificationUseCase: CreateNotificationUseCase) => {
        return new PaymentApprovedListener(createNotificationUseCase);
      },
      inject: [CreateNotificationUseCase],
    },
  ],
  exports: [CreateNotificationUseCase, NotificationDatabaseModule],
})
export class NotificationModule {}
