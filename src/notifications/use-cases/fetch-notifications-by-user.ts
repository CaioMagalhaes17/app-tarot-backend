import { Either, right } from 'src/core/Either';
import { INotificationRepository } from '../database/notification.repository.interface';
import { NotificationEntity } from '../notification.entity';

interface FetchNotificationsByUserRequest {
  userId: string;
  unreadOnly?: boolean;
}

export class FetchNotificationsByUserUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
  ) {}

  async execute(
    request: FetchNotificationsByUserRequest,
  ): Promise<Either<Error, { notifications: NotificationEntity[] }>> {
    let notifications: NotificationEntity[];

    if (request.unreadOnly) {
      notifications = await this.notificationRepository.findUnreadByUserId(
        request.userId,
      );
    } else {
      notifications = await this.notificationRepository.findByUserId(
        request.userId,
      );
    }

    return right({ notifications });
  }
}

