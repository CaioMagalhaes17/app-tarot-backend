import { Either, right } from 'src/core/Either';
import { INotificationRepository } from '../database/notification.repository.interface';
import { NotificationEntity, NotificationType } from '../notification.entity';

interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export class CreateNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
  ) {}

  async execute(
    request: CreateNotificationRequest,
  ): Promise<Either<Error, { id: string }>> {
    const notification = NotificationEntity.create({
      userId: request.userId,
      type: request.type,
      title: request.title,
      message: request.message,
      isRead: false,
      createdAt: new Date(),
      metadata: request.metadata,
    });

    const result = await this.notificationRepository.create(notification);

    return right(result);
  }
}

