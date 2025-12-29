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
import { NotificationGateway } from './gateways/notification.gateway';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { AuthModule } from 'src/infra/auth/auth.module';

@Module({
  imports: [NotificationDatabaseModule, AuthModule],
  controllers: [NotificationController],
  providers: [
    NotificationGateway,
    WsJwtGuard,
    {
      provide: CreateNotificationUseCase,
      useFactory: (notificationRepository: INotificationRepository) => {
        return new CreateNotificationUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: FetchNotificationsByUserUseCase,
      useFactory: (notificationRepository: INotificationRepository) => {
        return new FetchNotificationsByUserUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: MarkNotificationAsReadUseCase,
      useFactory: (notificationRepository: INotificationRepository) => {
        return new MarkNotificationAsReadUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: MarkAllNotificationsAsReadUseCase,
      useFactory: (notificationRepository: INotificationRepository) => {
        return new MarkAllNotificationsAsReadUseCase(notificationRepository);
      },
      inject: [NotificationRepository],
    },
    {
      provide: PaymentApprovedListener,
      useFactory: (
        createNotificationUseCase: CreateNotificationUseCase,
        notificationRepository: INotificationRepository,
        notificationGateway: NotificationGateway,
      ) => {
        return new PaymentApprovedListener(
          createNotificationUseCase,
          notificationRepository,
          notificationGateway,
        );
      },
      inject: [
        CreateNotificationUseCase,
        NotificationRepository,
        NotificationGateway,
      ],
    },
  ],
  exports: [CreateNotificationUseCase, NotificationDatabaseModule],
})
export class NotificationModule {}
