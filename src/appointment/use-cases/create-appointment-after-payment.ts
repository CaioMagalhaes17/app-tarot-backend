import { Either, left, right } from 'src/core/Either';
import { IAppointmentRepository } from '../database/appointment.repository.interface';
import { IAtendentServicesRepository } from 'src/atendent-services/database/atendent-services.repository.interface';
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { IAtendentRepository } from 'src/atendent/database/atendent.repository.interface';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found';
import { AppointmentEntity } from '../appointment.entity';
import { Weekday } from 'src/atendent/atendent.entity';

type CreateAppointmentAfterPaymentRequest = {
  paymentOrderId: string;
  atendentServiceId: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
};

export class CreateAppointmentAfterPaymentUseCase {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private atendentServiceRepository: IAtendentServicesRepository,
    private userRepository: IUserRepository,
    private atendentRepository: IAtendentRepository,
  ) {}

  async execute(
    request: CreateAppointmentAfterPaymentRequest,
  ): Promise<Either<ResourceNotFoundError | Error, { appointmentId: string }>> {
    // 1. Valida se atendentService existe
    const atendentService = await this.atendentServiceRepository.findById(
      request.atendentServiceId,
    );
    if (!atendentService) {
      return left(new ResourceNotFoundError('Serviço não encontrado'));
    }

    // 2. Valida se atendentService está ativo
    if (!atendentService.isActive) {
      return left(new Error('Serviço não está mais ativo'));
    }

    // 3. Valida se user existe
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      return left(new ResourceNotFoundError('Usuário não encontrado'));
    }

    // 4. Valida se data não é no passado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(request.date);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return left(new Error('Não é possível agendar em datas passadas'));
    }

    // 5. Valida disponibilidade do horário
    const atendentId = atendentService.atendent.id.toString();
    const atendent = await this.atendentRepository.findById(atendentId);
    if (!atendent) {
      return left(new ResourceNotFoundError('Atendente não encontrado'));
    }

    // Busca agendamentos do atendente na mesma data
    const startOfDay = new Date(request.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(request.date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments =
      await this.appointmentRepository.findAppointmentsByAtendentIdAndDateRange(
        atendentId,
        startOfDay,
        endOfDay,
      );

    // Verifica se há conflito de horário
    const hasConflict = existingAppointments.some((appointment) => {
      if (appointment.status === 'canceled') return false;

      const appointmentStart = this.timeToMinutes(appointment.startTime);
      const appointmentEnd = this.timeToMinutes(appointment.endTime);
      const requestedStart = this.timeToMinutes(request.startTime);
      const requestedEnd = this.timeToMinutes(request.endTime);

      // Verifica sobreposição de horários
      return (
        (requestedStart >= appointmentStart &&
          requestedStart < appointmentEnd) ||
        (requestedEnd > appointmentStart && requestedEnd <= appointmentEnd) ||
        (requestedStart <= appointmentStart && requestedEnd >= appointmentEnd)
      );
    });

    if (hasConflict) {
      return left(
        new Error(
          'Horário não está mais disponível. Foi ocupado por outro agendamento.',
        ),
      );
    }

    // 6. Valida se horário está dentro do schedule do atendente
    const weekday = this.getWeekday(request.date);
    const schedule = atendent.schedule[weekday];

    if (!schedule || schedule.length === 0) {
      return left(new Error('Atendente não trabalha neste dia da semana'));
    }

    const requestedStartMinutes = this.timeToMinutes(request.startTime);
    const requestedEndMinutes = this.timeToMinutes(request.endTime);

    const isWithinSchedule = schedule.some((workRange) => {
      const workStart = this.timeToMinutes(workRange.start);
      const workEnd = this.timeToMinutes(workRange.end);
      return (
        requestedStartMinutes >= workStart && requestedEndMinutes <= workEnd
      );
    });

    if (!isWithinSchedule) {
      return left(
        new Error(
          'Horário escolhido está fora do horário de trabalho do atendente',
        ),
      );
    }

    // 7. Cria Appointment vinculado ao PaymentOrder
    const appointment = AppointmentEntity.create({
      atendentService,
      user,
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      status: 'scheduled',
      paymentOrderId: request.paymentOrderId,
    });
    await this.appointmentRepository.create(appointment);
    return right({ appointmentId: appointment.id.toString() });
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private getWeekday(date: Date): Weekday {
    const weekdays: Weekday[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return weekdays[date.getDay()];
  }
}
