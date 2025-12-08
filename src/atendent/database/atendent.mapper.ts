import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { Atendent } from './atendent.schema';
import { AtendentEntity } from '../atendent.entity';
import { UserMapper } from 'src/user/database/user.mapper';

export class AtendentMapper
  implements BaseMapperInterface<Atendent, AtendentEntity> {
  constructor(private userMapper: UserMapper) {}
  toDomain(row: Atendent): AtendentEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    const user = row.userId as any;
    return AtendentEntity.create(
      {
        ...rest,
        user: this.userMapper.toDomain(user),
      },
      _id,
    );
  }

  toDomainArray(rows: Atendent[]): AtendentEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: AtendentEntity): Record<string, any> {
    return {
      id: domain.id.toString(),
      bio: domain.bio,
      name: domain.name,
      rating: domain.rating,
      schedule: domain.schedule,
      userId: domain.user.id.toString(),
    };
  }
}
