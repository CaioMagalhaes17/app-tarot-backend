import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { UserMapper } from 'src/user/database/user.mapper';
import { AppointmentEntity } from '../appointment.entity';
import { Appointment } from './appointment.schema';
import { AtendentServicesMapper } from 'src/atendent-services/database/atendent-services.mapper';

export class AppointmentMapper
  implements BaseMapperInterface<Appointment, AppointmentEntity> {
  constructor(
    private userMapper: UserMapper,
    private atendentServiceMapper: AtendentServicesMapper,
  ) {}
  toDomain(row: Appointment): AppointmentEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    const user = row.userId as any;
    const atendentService = row.atendentServiceId as any;
    return AppointmentEntity.create(
      {
        ...rest,
        user: this.userMapper.toDomain(user),
        atendentService: this.atendentServiceMapper.toDomain(atendentService),
      },
      _id,
    );
  }

  toDomainArray(rows: Appointment[]): AppointmentEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: AppointmentEntity): Record<string, any> {
    return {
      id: domain.id.toString(),
      atendentServiceId: domain.atendentService.id.toString(),
      userId: domain.user.id.toString(),
      date: domain.date,
      startTime: domain.startTime,
      endTime: domain.endTime,
      status: domain.status,
      canceledReason: domain.canceledReason,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
