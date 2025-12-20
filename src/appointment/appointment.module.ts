import { Module, forwardRef } from '@nestjs/common';
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
import { CreateAppointmentPaymentOrderUseCase } from './use-cases/create-appointment-payment-order';
import { CreatePaymentOrderUseCase } from 'src/payment/use-cases/create-payment-order';
import { PaymentOrderModule } from 'src/payment/payment-order.module';
import { IAtendentRepository } from 'src/atendent/database/atendent.repository.interface';
import { AtendentRepository } from 'src/atendent/database/atendent.repository';
import { AtendentDatabaseModule } from 'src/atendent/database/atendent.database.module';
import { ProcessAppointmentPaymentUseCase } from './use-cases/process-appointment-payment';
import { CreateAppointmentAfterPaymentUseCase } from './use-cases/create-appointment-after-payment';
import { IPaymentOrderRepository } from 'src/payment/database/payment-order.repository.interface';
import { PaymentOrderRepository } from 'src/payment/database/payment-order.repository';
import { PaymentOrderDatabaseModule } from 'src/payment/database/payment-oder.module';

@Module({
  imports: [
    UserDatabaseModule,
    AppointmentDatabaseModule,
    AtendentServicesDatabaseModule,
    forwardRef(() => PaymentOrderModule),
    AtendentDatabaseModule,
    PaymentOrderDatabaseModule,
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
    {
      provide: CreateAppointmentPaymentOrderUseCase,
      useFactory: (
        atendentServiceRepository: IAtendentServicesRepository,
        createPaymentOrderUseCase: CreatePaymentOrderUseCase,
        appointmentRepository: IAppointmentRepository,
        atendentRepository: IAtendentRepository,
      ) => {
        return new CreateAppointmentPaymentOrderUseCase(
          atendentServiceRepository,
          createPaymentOrderUseCase,
          appointmentRepository,
          atendentRepository,
        );
      },
      inject: [
        AtendentServicesRepository,
        CreatePaymentOrderUseCase,
        AppointmentRepository,
        AtendentRepository,
      ],
    },
    {
      provide: CreateAppointmentAfterPaymentUseCase,
      useFactory: (
        appointmentRepository: IAppointmentRepository,
        atendentServiceRepository: IAtendentServicesRepository,
        userRepository: IUserRepository,
        atendentRepository: IAtendentRepository,
      ) => {
        return new CreateAppointmentAfterPaymentUseCase(
          appointmentRepository,
          atendentServiceRepository,
          userRepository,
          atendentRepository,
        );
      },
      inject: [
        AppointmentRepository,
        AtendentServicesRepository,
        UserRepository,
        AtendentRepository,
      ],
    },
    {
      provide: ProcessAppointmentPaymentUseCase,
      useFactory: (
        paymentOrderRepository: IPaymentOrderRepository,
        appointmentRepository: IAppointmentRepository,
        createAppointmentAfterPayment: CreateAppointmentAfterPaymentUseCase,
      ) => {
        return new ProcessAppointmentPaymentUseCase(
          paymentOrderRepository,
          appointmentRepository,
          createAppointmentAfterPayment,
        );
      },
      inject: [
        PaymentOrderRepository,
        AppointmentRepository,
        CreateAppointmentAfterPaymentUseCase,
      ],
    },
  ],
  exports: [ProcessAppointmentPaymentUseCase],
})
export class AppointmentModule {}
