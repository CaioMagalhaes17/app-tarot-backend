import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { AtendentServicesEntity } from '../atendent-services.entity';
import { AtendentServices } from './atendent-services.schema';
import { ServicesMapper } from 'src/services/database/services.mapper';
import { AtendentMapper } from 'src/atendent/database/atendent.mapper';

export class AtendentServicesMapper
  implements BaseMapperInterface<AtendentServices, AtendentServicesEntity> {
  constructor(
    private serviceMapper: ServicesMapper,
    private atendentMapper: AtendentMapper,
  ) {}
  toDomain(row: AtendentServices): AtendentServicesEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    const service = row.serviceId as any;
    const atendentId = row.atendentId as any;

    return AtendentServicesEntity.create(
      {
        ...rest,
        service: this.serviceMapper.toDomain(service),
        atendent: this.atendentMapper.toDomain(atendentId),
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
      id: domain.id.toString(),
      description: domain.description,
      price: domain.price,
      serviceId: domain.service.id.toString(),
      atendentId: domain.atendent.id.toString(),
      isActive: domain.isActive,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
