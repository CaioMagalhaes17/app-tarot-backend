import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/Either';
import { INotificationRepository } from '../database/notification.repository.interface';
import { NotificationNotFound } from '../errors/NotificationNotFound';

interface MarkNotificationAsReadRequest {
  notificationId: string;
  userId: string;
}

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
  ) {}

  async execute(
    request: MarkNotificationAsReadRequest,
  ): Promise<Either<NotificationNotFound, null>> {
    const notification = await this.notificationRepository.findById(
      request.notificationId,
    );

    if (!notification) {
      return left(new NotificationNotFound());
    }

    if (notification.userId !== request.userId) {
      return left(new NotificationNotFound('Notificação não encontrada'));
    }

    notification.markAsRead();
    await this.notificationRepository.updateById(
      request.notificationId,
      notification,
    );

    return right(null);
  }
}

