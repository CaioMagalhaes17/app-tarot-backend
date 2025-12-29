import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { NotificationEntity } from '../notification.entity';
import { NotificationPresenter } from '../notification.presenter';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
  namespace: '/notifications',
})
@UseGuards(WsJwtGuard)
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    const userId = (client as any).user?.id;
    if (!userId) {
      client.disconnect();
      return;
    }

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(client.id);

    client.join(`user:${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).user?.id;
    if (!userId) return;

    const userSocketSet = this.userSockets.get(userId);
    if (userSocketSet) {
      userSocketSet.delete(client.id);
      if (userSocketSet.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  emitNotificationToUser(userId: string, notification: NotificationEntity) {
    const notificationData = NotificationPresenter.toHttp(notification);
    this.server.to(`user:${userId}`).emit('new_notification', notificationData);
  }

  emitNotificationCountToUser(userId: string, unreadCount: number) {
    this.server.to(`user:${userId}`).emit('notification_count', {
      unreadCount,
    });
  }
}
