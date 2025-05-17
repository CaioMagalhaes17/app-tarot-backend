import { Module } from '@nestjs/common';
import { ServicesDatabaseModule } from './database/services.database.module';
import { ServicesController } from './services.controller';
import { GetAllServicesUseCase } from './use-cases/get-all-services';
import { IServicesRepository } from './database/services.repository.interface';
import { ServicesRepository } from './database/services.repository';
import { GetServiceByIdUseCase } from './use-cases/get-service-by-id';

@Module({
  imports: [ServicesDatabaseModule],
  controllers: [ServicesController],
  providers: [
    {
      provide: GetAllServicesUseCase,
      useFactory: (servicesRepository: IServicesRepository) => {
        return new GetAllServicesUseCase(servicesRepository);
      },
      inject: [ServicesRepository],
    },
    {
      provide: GetServiceByIdUseCase,
      useFactory: (servicesRepository: IServicesRepository) => {
        return new GetServiceByIdUseCase(servicesRepository);
      },
      inject: [ServicesRepository],
    },
  ],
})
export class ServicesModule {}
