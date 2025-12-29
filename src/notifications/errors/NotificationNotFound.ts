export class NotificationNotFound extends Error {
  constructor(message?: string) {
    super(message || 'Notificação não encontrada');
    this.name = 'NotificationNotFound';
  }
}

