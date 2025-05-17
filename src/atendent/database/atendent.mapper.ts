import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { Atendent } from './atendent.schema';
import { AtendentEntity } from '../atendent.entity';

export class AtendentMapper
  implements BaseMapperInterface<Atendent, AtendentEntity> {
  toDomain(row: Atendent): AtendentEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    return AtendentEntity.create(
      {
        ...rest,
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
}
