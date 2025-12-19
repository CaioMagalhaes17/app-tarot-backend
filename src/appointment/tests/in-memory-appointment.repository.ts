import { IAppointmentRepository } from '../database/appointment.repository.interface';
import { AppointmentEntity } from '../appointment.entity';

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  appointments: AppointmentEntity[] = [];

  async create(data: AppointmentEntity): Promise<{ id: string }> {
    this.appointments.push(data);
    return { id: data.id.toString() };
  }

  async findAll(): Promise<AppointmentEntity[]> {
    return this.appointments;
  }

  async findById(id: string): Promise<AppointmentEntity | null> {
    const appointment = this.appointments.find(
      (item) => item.id.toString() === id,
    );
    return appointment || null;
  }

  async findAppointmentsByUserId(userId: string): Promise<AppointmentEntity[]> {
    return this.appointments.filter(
      (appointment) => appointment.user.id.toString() === userId,
    );
  }

  async findAppointmentsByAtendentId(
    atendentId: string,
  ): Promise<AppointmentEntity[]> {
    return this.appointments.filter(
      (appointment) =>
        appointment.atendentService.atendent.id.toString() === atendentId,
    );
  }

  async findAppointmentsByAtendentIdAndDateRange(
    atendentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AppointmentEntity[]> {
    return this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const isInRange =
        appointmentDate >= startDate && appointmentDate <= endDate;
      const isAtendentMatch =
        appointment.atendentService.atendent.id.toString() === atendentId;
      const isNotCanceled = appointment.status !== 'canceled';

      return isInRange && isAtendentMatch && isNotCanceled;
    });
  }

  async updateById(id: string, updateData: AppointmentEntity): Promise<void> {
    const index = this.appointments.findIndex(
      (item) => item.id.toString() === id,
    );
    if (index !== -1) {
      this.appointments[index] = updateData;
    }
  }

  async deleteById(id: string): Promise<void> {
    const index = this.appointments.findIndex(
      (item) => item.id.toString() === id,
    );
    if (index !== -1) {
      this.appointments.splice(index, 1);
    }
  }

  async deleteAll(): Promise<void> {
    this.appointments = [];
  }

  async findByParam<ParamType>(
    param: Partial<ParamType>,
    paginateObj?: { page: number; limit: number },
  ): Promise<AppointmentEntity[]> {
    return this.appointments;
  }

  async search(field: string, query: string): Promise<AppointmentEntity[]> {
    return this.appointments;
  }

  async findAllPaginated<T>(
    page: number,
    limit: number,
    param?: T,
  ): Promise<{
    data: AppointmentEntity[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const data = this.appointments.slice(skip, skip + limit);
    const total = this.appointments.length;

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}

