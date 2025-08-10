import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { ClientMinutes } from './client-minutes.schema';
import { ClientMinutesEntity } from '../client-minutes.entity';

export class ClientMinutesMapper
  implements BaseMapperInterface<ClientMinutes, ClientMinutesEntity> {
  toDomain(row: ClientMinutes): ClientMinutesEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    return ClientMinutesEntity.create(
      {
        ...rest,
        user: row.userId,
      },
      _id,
    );
  }

  toDomainArray(rows: ClientMinutes[]): ClientMinutesEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: ClientMinutesEntity) {
    return {
      userId: domain.user.id.toString(),
      avaliableMinutes: domain.avaliableMinutes,
      totalMinutes: domain.totalMinutes,
      transactions: domain.transactions,
    };
  }
}
