import { Module } from '@nestjs/common';
import { UserDatabaseModule } from 'src/user/database/user.database.module';
import { AppointmentDatabaseModule } from './database/appointment.database.module';
import { AtendentServicesDatabaseModule } from 'src/atendent-services/database/atendent-services.database.module';
import { AppointmentController } from './appointment.controller';
import { FetchAllAppointmentsByAtendent } from './use-cases/fetch-all-appointments-by-atendent';
import { IAppointmentRepository } from './database/appointment.repository.interface';
import { AppointmentRepository } from './database/appointment.repository';
import { FetchAllAppointmentsByUser } from './use-cases/fetch-all-appointments-by-user';
import { ScheduleAppointmentUseCase } from './use-cases/schedule-appointment';
import { IAtendentServicesRepository } from 'src/atendent-services/database/atendent-services.repository.interface';
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { AtendentServicesRepository } from 'src/atendent-services/database/atendent-services.repository';
import { UserRepository } from 'src/user/database/user.repository';
import { UpdateAppointmentUseCase } from './use-cases/update-appointment';

@Module({
  imports: [
    UserDatabaseModule,
    AppointmentDatabaseModule,
    AtendentServicesDatabaseModule,
  ],
  controllers: [AppointmentController],
  providers: [
    {
      provide: FetchAllAppointmentsByAtendent,
      useFactory: (appointmentRepository: IAppointmentRepository) => {
        return new FetchAllAppointmentsByAtendent(appointmentRepository);
      },
      inject: [AppointmentRepository],
    },
    {
      provide: FetchAllAppointmentsByUser,
      useFactory: (appointmentRepository: IAppointmentRepository) => {
        return new FetchAllAppointmentsByUser(appointmentRepository);
      },
      inject: [AppointmentRepository],
    },
    {
      provide: ScheduleAppointmentUseCase,
      useFactory: (
        appointmentRepository: IAppointmentRepository,
        atendentServiceRepository: IAtendentServicesRepository,
        userRepository: IUserRepository,
      ) => {
        return new ScheduleAppointmentUseCase(
          appointmentRepository,
          atendentServiceRepository,
          userRepository,
        );
      },
      inject: [
        AppointmentRepository,
        AtendentServicesRepository,
        UserRepository,
      ],
    },
    {
      provide: UpdateAppointmentUseCase,
      useFactory: (appointmentRepository: IAppointmentRepository) => {
        return new UpdateAppointmentUseCase(appointmentRepository);
      },
      inject: [AppointmentRepository],
    },
  ],
})
export class AppointmentModule {}
