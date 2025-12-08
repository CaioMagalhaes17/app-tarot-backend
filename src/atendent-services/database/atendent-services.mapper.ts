import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { AtendentServicesEntity } from '../atendent-services.entity';
import { AtendentServices } from './atendent-services.schema';

export class AtendentServicesMapper
  implements BaseMapperInterface<AtendentServices, AtendentServicesEntity> {
  toDomain(row: AtendentServices): AtendentServicesEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    return AtendentServicesEntity.create(
      {
        ...rest,
      },
      _id,
    );
  }

  toDomainArray(rows: AtendentServices[]): AtendentServicesEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: AtendentServicesEntity): Record<string, any> {
    return {
      toBeImplemented: '',
    };
  }
}
