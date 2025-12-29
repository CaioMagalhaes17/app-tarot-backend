import { NotificationEntity } from './notification.entity';

export class NotificationPresenter {
  static toHttp(notification: NotificationEntity) {
    return {
      id: notification.id.toString(),
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      metadata: notification.metadata,
    };
  }

  static toHttpArray(notifications: NotificationEntity[]) {
    return notifications.map((notification) => this.toHttp(notification));
  }
}

