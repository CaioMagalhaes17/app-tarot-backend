import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationRepository } from './notification.repository';
import { NotificationMapper } from './notification.mapper';
import { INotificationRepository } from './notification.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    NotificationMapper,
    {
      provide: INotificationRepository,
      useClass: NotificationRepository,
    },
  ],
  exports: [INotificationRepository],
})
export class NotificationDatabaseModule {}

