import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';

export type NotificationType = 'payment_approved' | 'appointment_created' | 'appointment_cancelled' | 'general';

export interface NotificationEntityProps {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: Record<string, any>;
}

export class NotificationEntity extends BaseEntity<NotificationEntityProps> {
  static create(props: NotificationEntityProps, id?: string) {
    return new NotificationEntity(props, new UniqueEntityID(id));
  }

  get userId() {
    return this.props.userId;
  }

  get type() {
    return this.props.type;
  }

  get title() {
    return this.props.title;
  }

  get message() {
    return this.props.message;
  }

  get isRead() {
    return this.props.isRead;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get metadata() {
    return this.props.metadata;
  }

  markAsRead() {
    this.props.isRead = true;
    this.touch();
  }

  touch() {
    this.props.updatedAt = new Date();
  }
}

