import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { Services } from './services.schema';
import { ServicesEntity } from '../services.entity';

export class ServicesMapper
  implements BaseMapperInterface<Services, ServicesEntity> {
  toDomain(row: Services): ServicesEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    return ServicesEntity.create(
      {
        ...rest,
      },
      _id,
    );
  }

  toDomainArray(rows: Services[]): ServicesEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: ServicesEntity): Record<string, any> {
    return {
      toBeImplemented: '',
    };
  }
}
