import { BaseInfraRepository } from 'src/core/base.repository';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { NotificationEntity, NotificationType } from '../notification.entity';
import { NotificationMapper } from './notification.mapper';
import { INotificationRepository } from './notification.repository.interface';

export class NotificationRepository
  extends BaseInfraRepository<Notification, NotificationEntity>
  implements INotificationRepository {
  constructor(
    protected readonly model: Model<Notification>,
    protected readonly mapper: NotificationMapper,
  ) {
    super(model, mapper);
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    return this.mapper.toDomainArray(
      await this.model
        .find({ userId })
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
    );
  }

  async findUnreadByUserId(userId: string): Promise<NotificationEntity[]> {
    return this.mapper.toDomainArray(
      await this.model
        .find({ userId, isRead: false })
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
    );
  }

  async markAllAsReadByUserId(userId: string): Promise<void> {
    await this.model.updateMany({ userId, isRead: false }, { isRead: true });
  }

  async findByPaymentOrderId(
    paymentOrderId: string,
    type: NotificationType,
  ): Promise<NotificationEntity | null> {
    const result = await this.model
      .findOne({
        type,
        'metadata.paymentOrderId': paymentOrderId,
      })
      .lean()
      .exec();

    if (!result) return null;
    return this.mapper.toDomain(result);
  }
}

