import { IAppointmentRepository } from '../database/appointment.repository.interface';

export class FetchAllAppointmentsByUser {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string) {
    const result =
      await this.appointmentRepository.findAppointmentsByUserId(userId);
    return result;
  }
}
