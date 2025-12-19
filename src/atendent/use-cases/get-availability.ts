import { Either, left, right } from 'src/core/Either';
import { IAtendentRepository } from '../database/atendent.repository.interface';
import { IAppointmentRepository } from 'src/appointment/database/appointment.repository.interface';
import { AtendentNotFound } from '../errors/AtendentNotFound';
import { Weekday } from '../atendent.entity';
import { AppointmentEntity } from 'src/appointment/appointment.entity';

type TimeSlot = {
  start: string;
  end: string;
};

type DayAvailability = {
  date: string; // ISO date string (YYYY-MM-DD)
  weekday: Weekday;
  availableSlots: TimeSlot[];
};

type GetAvailabilityResponse = {
  days: DayAvailability[];
};

export class GetAvailabilityUseCase {
  constructor(
    private atendentRepository: IAtendentRepository,
    private appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(
    atendentId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Either<AtendentNotFound, GetAvailabilityResponse>> {
    const atendent = await this.atendentRepository.findById(atendentId);

    if (!atendent) {
      return left(new AtendentNotFound());
    }

    // Define o período padrão (próximos 30 dias)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Garante que a data inicial não seja no passado
    const defaultStartDate = startDate
      ? new Date(Math.max(startDate.getTime(), today.getTime()))
      : today;
    const defaultEndDate =
      endDate || new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Busca agendamentos do atendente no período
    const appointments =
      await this.appointmentRepository.findAppointmentsByAtendentIdAndDateRange(
        atendentId,
        defaultStartDate,
        defaultEndDate,
      );

    // Filtra apenas agendamentos não cancelados
    const activeAppointments = appointments.filter(
      (appointment) => appointment.status !== 'canceled',
    );

    // Gera os dias disponíveis
    const days = this.generateAvailableDays(
      atendent.schedule,
      defaultStartDate,
      defaultEndDate,
      activeAppointments,
    );

    return right({ days });
  }

  private generateAvailableDays(
    schedule: Record<Weekday, { start: string; end: string }[]>,
    startDate: Date,
    endDate: Date,
    appointments: AppointmentEntity[],
  ): DayAvailability[] {
    const days: DayAvailability[] = [];
    const currentDate = new Date(startDate);

    // Mapeia os nomes dos dias da semana
    const weekdayMap: Record<number, Weekday> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    };

    while (currentDate <= endDate) {
      // Não mostra dias no passado
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const weekday = weekdayMap[currentDate.getDay()];
      const daySchedule = schedule[weekday];

      // Se o atendente não trabalha neste dia, pula
      if (!daySchedule || daySchedule.length === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Busca agendamentos deste dia
      const dayAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getDate() === currentDate.getDate() &&
          appointmentDate.getMonth() === currentDate.getMonth() &&
          appointmentDate.getFullYear() === currentDate.getFullYear()
        );
      });

      // Gera os slots disponíveis para este dia
      const availableSlots = this.calculateAvailableSlots(
        daySchedule,
        dayAppointments,
      );

      if (availableSlots.length > 0) {
        days.push({
          date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD
          weekday,
          availableSlots,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }

  private calculateAvailableSlots(
    daySchedule: { start: string; end: string }[],
    appointments: AppointmentEntity[],
  ): TimeSlot[] {
    const availableSlots: TimeSlot[] = [];

    // Para cada período de trabalho do dia
    for (const workPeriod of daySchedule) {
      const periodStart = this.timeToMinutes(workPeriod.start);
      const periodEnd = this.timeToMinutes(workPeriod.end);

      // Cria slots de 30 minutos dentro deste período
      let currentSlotStart = periodStart;

      while (currentSlotStart < periodEnd) {
        const slotEnd = Math.min(currentSlotStart + 30, periodEnd);
        const slotStartTime = this.minutesToTime(currentSlotStart);
        const slotEndTime = this.minutesToTime(slotEnd);

        // Verifica se este slot não está ocupado
        const isAvailable = !appointments.some((appointment) => {
          const appointmentStart = this.timeToMinutes(appointment.startTime);
          const appointmentEnd = this.timeToMinutes(appointment.endTime);

          // Verifica sobreposição
          return (
            (currentSlotStart >= appointmentStart &&
              currentSlotStart < appointmentEnd) ||
            (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
            (currentSlotStart <= appointmentStart && slotEnd >= appointmentEnd)
          );
        });

        if (isAvailable) {
          availableSlots.push({
            start: slotStartTime,
            end: slotEndTime,
          });
        }

        currentSlotStart = slotEnd;
      }
    }

    return availableSlots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

