import { User } from './user.schema';
import { UserEntity } from '../user.entity';
import { BaseMapper } from 'src/core/base.mapper';

export class UserMapper implements BaseMapper<User, UserEntity> {
  toDomain(row: User): UserEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    return UserEntity.create(
      {
        ...rest,
      },
      _id,
    );
  }

  toDomainArray(rows: User[]): UserEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }
}
