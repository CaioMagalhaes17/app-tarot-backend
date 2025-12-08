import { Either, left, right } from 'src/core/Either';
import { AppointmentStatus } from '../appointment.entity';
import { IAppointmentRepository } from '../database/appointment.repository.interface';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found';

type UpdateAppointmentUseCaseRequest = {
  date?: Date;
  startTime?: string;
  endTime?: string;
  status?: AppointmentStatus;
  canceledReason?: string;
};
export class UpdateAppointmentUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(
    appointmentId: string,
    props: UpdateAppointmentUseCaseRequest,
  ): Promise<Either<ResourceNotFoundError, null>> {
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment)
      return left(new ResourceNotFoundError('Consulta não encontrada!'));
    appointment.updateAppointment(props);
    await this.appointmentRepository.updateById(appointmentId, appointment);
    return right(null);
  }
}
