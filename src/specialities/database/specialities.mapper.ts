import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { SpecialitiesEntity } from '../specialities.entity';
import { Specialities } from './specialities.schema';

export class SpecialitiesMapper
  implements BaseMapperInterface<Specialities, SpecialitiesEntity> {
  toDomain(row: Specialities): SpecialitiesEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    return SpecialitiesEntity.create(
      {
        ...rest,
      },
      _id,
    );
  }

  toDomainArray(rows: Specialities[]): SpecialitiesEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: SpecialitiesEntity): Record<string, any> {
    return {
      toBeImplemented: '',
    };
  }
}
