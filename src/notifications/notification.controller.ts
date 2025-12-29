import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { FetchNotificationsByUserUseCase } from './use-cases/fetch-notifications-by-user';
import { MarkNotificationAsReadUseCase } from './use-cases/mark-notification-as-read';
import { MarkAllNotificationsAsReadUseCase } from './use-cases/mark-all-notifications-as-read';
import { NotificationNotFound } from './errors/NotificationNotFound';
import { NotificationPresenter } from './notification.presenter';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private fetchNotificationsByUserUseCase: FetchNotificationsByUserUseCase,
    private markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
  ) {}

  @Get()
  async getNotifications(
    @Req() req: { user: { id: string } },
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const response = await this.fetchNotificationsByUserUseCase.execute({
      userId: req.user.id,
      unreadOnly: unreadOnly === 'true',
    });

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message);
    }
    return {
      notifications: NotificationPresenter.toHttpArray(
        response.value.notifications,
      ),
    };
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    const response = await this.markNotificationAsReadUseCase.execute({
      notificationId: id,
      userId: req.user.id,
    });

    if (response.isLeft()) {
      switch (response.value.constructor) {
        case NotificationNotFound:
          throw new BadRequestException(response.value.message);
        default:
          throw new BadRequestException('Erro ao marcar notificação como lida');
      }
    }

    return { message: 'Notificação marcada como lida' };
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: { user: { id: string } }) {
    const response = await this.markAllNotificationsAsReadUseCase.execute({
      userId: req.user.id,
    });

    if (response.isLeft()) {
      throw new BadRequestException('Erro ao marcar notificações como lidas');
    }

    return { message: 'Todas as notificações foram marcadas como lidas' };
  }
}
