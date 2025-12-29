import { Injectable } from '@nestjs/common';
import { Either, right } from 'src/core/Either';
import { INotificationRepository } from '../database/notification.repository.interface';

interface MarkAllNotificationsAsReadRequest {
  userId: string;
}

@Injectable()
export class MarkAllNotificationsAsReadUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
  ) {}

  async execute(
    request: MarkAllNotificationsAsReadRequest,
  ): Promise<Either<Error, null>> {
    await this.notificationRepository.markAllAsReadByUserId(request.userId);

    return right(null);
  }
}

