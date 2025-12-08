import { Module } from '@nestjs/common';
import { AtendentServicesDatabaseModule } from './database/atendent-services.database.module';
import { AtendentServicesController } from './atendent-services.controller';
import { ChooseServicesUseCase } from './use-cases/choose-services';
import { IAtendentServicesRepository } from './database/atendent-services.repository.interface';
import { IServicesRepository } from 'src/services/database/services.repository.interface';
import { IAtendentRepository } from 'src/atendent/database/atendent.repository.interface';
import { AtendentServicesRepository } from './database/atendent-services.repository';
import { ServicesRepository } from 'src/services/database/services.repository';
import { AtendentRepository } from 'src/atendent/database/atendent.repository';
import { ExcludeServiceUseCase } from './use-cases/exclude-service';
import { FetchAtendentServices } from './use-cases/fetch-all-atendent-services';
import { FetchAtendentServiceByIdUseCase } from './use-cases/fetch-atendent-services-by-id';
import { ServicesDatabaseModule } from 'src/services/database/services.database.module';
import { AtendentDatabaseModule } from 'src/atendent/database/atendent.database.module';
import { FetchAllAtendentServicesByService } from './use-cases/fetch-all-atendent-services-by-service';
import { UpdateAtendentServiceUseCase } from './use-cases/update-service';

@Module({
  imports: [
    AtendentServicesDatabaseModule,
    ServicesDatabaseModule,
    AtendentDatabaseModule,
  ],
  controllers: [AtendentServicesController],
  providers: [
    {
      provide: ChooseServicesUseCase,
      useFactory: (
        appointmentRepository: IAtendentServicesRepository,
        servicesRepository: IServicesRepository,
        atendentRepository: IAtendentRepository,
      ) => {
        return new ChooseServicesUseCase(
          appointmentRepository,
          servicesRepository,
          atendentRepository,
        );
      },
      inject: [
        AtendentServicesRepository,
        ServicesRepository,
        AtendentRepository,
      ],
    },
    {
      provide: ExcludeServiceUseCase,
      useFactory: (appointmentRepository: IAtendentServicesRepository) => {
        return new ExcludeServiceUseCase(appointmentRepository);
      },
      inject: [AtendentServicesRepository],
    },
    {
      provide: UpdateAtendentServiceUseCase,
      useFactory: (appointmentRepository: IAtendentServicesRepository) => {
        return new UpdateAtendentServiceUseCase(appointmentRepository);
      },
      inject: [AtendentServicesRepository],
    },
    {
      provide: FetchAtendentServices,
      useFactory: (appointmentRepository: IAtendentServicesRepository) => {
        return new FetchAtendentServices(appointmentRepository);
      },
      inject: [AtendentServicesRepository],
    },
    {
      provide: FetchAtendentServiceByIdUseCase,
      useFactory: (appointmentRepository: IAtendentServicesRepository) => {
        return new FetchAtendentServiceByIdUseCase(appointmentRepository);
      },
      inject: [AtendentServicesRepository],
    },
    {
      provide: FetchAllAtendentServicesByService,
      useFactory: (appointmentRepository: IAtendentServicesRepository) => {
        return new FetchAllAtendentServicesByService(appointmentRepository);
      },
      inject: [AtendentServicesRepository],
    },
  ],
})
export class AtendentServicesModule {}
