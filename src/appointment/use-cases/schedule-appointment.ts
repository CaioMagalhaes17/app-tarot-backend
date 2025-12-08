import { AppointmentEntity } from '../appointment.entity';
import { IAppointmentRepository } from '../database/appointment.repository.interface';
import { left } from 'src/core/Either';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found';
import { IAtendentServicesRepository } from 'src/atendent-services/database/atendent-services.repository.interface';
import { UserRepository } from 'src/user/database/user.repository';

type ScheduleAppointmentUseCaseRequest = {
  userId: string;
  atendentServiceId: string;
  date: Date;
  startTime: string;
  endTime: string;
};

export class ScheduleAppointmentUseCase {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private atendentServiceRepository: IAtendentServicesRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    atendentServiceId,
    date,
    endTime,
    startTime,
    userId,
  }: ScheduleAppointmentUseCaseRequest) {
    const atendentService =
      await this.atendentServiceRepository.findById(atendentServiceId);
    if (!atendentService)
      return left(new ResourceNotFoundError('Serviço não encontrado'));
    const user = await this.userRepository.findById(userId);
    if (!user) return left(new ResourceNotFoundError('Usuário não encontrado'));
    const appointment = AppointmentEntity.create({
      atendentService,
      date,
      endTime,
      startTime,
      status: 'scheduled',
      user,
    });
    await this.appointmentRepository.create(appointment);
  }
}
