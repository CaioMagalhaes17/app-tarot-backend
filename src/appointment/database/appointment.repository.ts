import { BaseInfraRepository } from 'src/core/base.repository';
import { Model, Types } from 'mongoose';
import { Appointment } from './appointment.schema';
import { AppointmentEntity } from '../appointment.entity';
import { AppointmentMapper } from './appointment.mapper';

export class AppointmentRepository extends BaseInfraRepository<
  Appointment,
  AppointmentEntity
> {
  constructor(
    protected readonly model: Model<Appointment>,
    protected readonly mapper: AppointmentMapper,
  ) {
    super(model, mapper);
  }

  async findAll(): Promise<AppointmentEntity[]> {
    return this.mapper.toDomainArray(
      await this.model
        .find([
          'userId',
          {
            path: 'atendentServiceId',
            populate: [
              {
                path: 'atendentId',
                populate: 'userId',
              },
              {
                path: 'serviceId',
              },
            ],
          },
        ])
        .exec(),
    );
  }

  async findAppointmentsByUserId(userId: string) {
    const appointments = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .populate([
        'userId',
        {
          path: 'atendentServiceId',
          populate: [
            {
              path: 'atendentId',
              populate: 'userId',
            },
            {
              path: 'serviceId',
            },
          ],
        },
      ])
      .exec();
    return this.mapper.toDomainArray(appointments);
  }

  async findAppointmentsByAtendentId(atendentId: string) {
    const atendent = await this.model
      .find()
      .populate([
        'userId',
        {
          path: 'atendentServiceId',
          populate: [
            {
              path: 'atendentId',
              match: { _id: atendentId },
              populate: 'userId',
            },
            {
              path: 'serviceId',
            },
          ],
        },
      ])
      .exec();
    return this.mapper.toDomainArray(atendent);
  }

  async findById(id: string) {
    const atendent = this.mapper.toDomain(
      await this.model
        .findById(new Types.ObjectId(id))
        .populate([
          'userId',
          {
            path: 'atendentServiceId',
            populate: [
              {
                path: 'atendentId',
                populate: 'userId',
              },
              {
                path: 'serviceId',
              },
            ],
          },
        ])
        .exec(),
    );
    return atendent;
  }

  async;

  async findAllPaginated<T = unknown>(page: number, limit: number, param?: T) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model
        .find(param)
        .skip(skip)
        .limit(limit)
        .populate([
          'userId',
          {
            path: 'atendentServiceId',
            populate: [
              {
                path: 'atendentId',
                populate: 'userId',
              },
              {
                path: 'serviceId',
              },
            ],
          },
        ])
        .exec(),
      this.model.countDocuments().exec(),
    ]);

    return {
      data: this.mapper.toDomainArray(data),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
