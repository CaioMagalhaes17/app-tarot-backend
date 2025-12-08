import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { AppointmentEntity } from '../appointment.entity';

export interface IAppointmentRepository
  extends BaseDomainRepository<AppointmentEntity> {
  findAppointmentsByUserId(userId: string): Promise<AppointmentEntity[]>;
  findAppointmentsByAtendentId(
    atendentId: string,
  ): Promise<AppointmentEntity[]>;
}
