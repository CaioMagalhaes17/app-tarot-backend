import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
      provide: NotificationRepository,
      useFactory: (
        model: Model<Notification>,
        mapper: NotificationMapper,
      ) => {
        return new NotificationRepository(model, mapper);
      },
      inject: [getModelToken(Notification.name), NotificationMapper],
    },
    {
      provide: INotificationRepository,
      useExisting: NotificationRepository,
    },
  ],
  exports: [NotificationRepository, INotificationRepository],
})
export class NotificationDatabaseModule {}

