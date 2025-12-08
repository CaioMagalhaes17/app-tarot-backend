import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMapper } from 'src/user/database/user.mapper';
import { UserDatabaseModule } from 'src/user/database/user.database.module';
import { Appointment, AppointmentSchema } from './appointment.schema';
import { AppointmentMapper } from './appointment.mapper';
import { AtendentServicesMapper } from 'src/atendent-services/database/atendent-services.mapper';
import { AppointmentRepository } from './appointment.repository';
import { AtendentServicesDatabaseModule } from 'src/atendent-services/database/atendent-services.database.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    UserDatabaseModule,
    AtendentServicesDatabaseModule,
  ],
  providers: [
    {
      provide: AppointmentMapper,
      useFactory: (
        userMapper: UserMapper,
        atendentServiceMapper: AtendentServicesMapper,
      ) => {
        return new AppointmentMapper(userMapper, atendentServiceMapper);
      },
      inject: [UserMapper, AtendentServicesMapper],
    },
    {
      provide: AppointmentRepository,
      useFactory: (model: Model<Appointment>, mapper: AppointmentMapper) => {
        return new AppointmentRepository(model, mapper);
      },
      inject: [getModelToken(Appointment.name), AppointmentMapper],
    },
  ],
  exports: [AppointmentRepository],
})
export class AppointmentDatabaseModule {}
