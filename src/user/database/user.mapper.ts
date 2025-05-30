import { User } from './user.schema';
import { UserEntity } from '../user.entity';
import { BaseMapperInterface } from 'src/core/base.mapper.interface';

export class UserMapper implements BaseMapperInterface<User, UserEntity> {
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
