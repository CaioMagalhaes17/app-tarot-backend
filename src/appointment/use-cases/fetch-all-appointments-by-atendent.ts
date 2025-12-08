import { IAppointmentRepository } from '../database/appointment.repository.interface';

export class FetchAllAppointmentsByAtendent {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(atendentId: string) {
    const result =
      await this.appointmentRepository.findAppointmentsByAtendentId(atendentId);
    return result;
  }
}
