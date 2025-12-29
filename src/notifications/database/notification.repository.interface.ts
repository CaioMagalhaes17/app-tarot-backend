import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { NotificationEntity } from '../notification.entity';

export interface INotificationRepository
  extends BaseDomainRepository<NotificationEntity> {
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  findUnreadByUserId(userId: string): Promise<NotificationEntity[]>;
  markAllAsReadByUserId(userId: string): Promise<void>;
}

