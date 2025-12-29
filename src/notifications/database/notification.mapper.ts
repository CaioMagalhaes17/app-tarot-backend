import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { Notification } from './notification.schema';
import { NotificationEntity } from '../notification.entity';

export class NotificationMapper
  implements BaseMapperInterface<Notification, NotificationEntity> {
  toDomain(row: any): NotificationEntity {
    if (!row) return;
    const { _id } = row;
    return NotificationEntity.create(
      {
        createdAt: row.createdAt,
        isRead: row.isRead,
        message: row.message,
        title: row.title,
        type: row.type,
        metadata: row.metadata,
        updatedAt: row.updatedAt,
        userId: row.userId,
      },
      _id.toString(),
    );
  }

  toDomainArray(rows: Notification[]): NotificationEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: NotificationEntity) {
    return {
      userId: domain.userId,
      type: domain.type,
      title: domain.title,
      message: domain.message,
      isRead: domain.isRead,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      metadata: domain.metadata,
    };
  }
}
