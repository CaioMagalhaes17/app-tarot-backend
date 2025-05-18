import { Module } from '@nestjs/common';

import { GetAllSpecialitiesUseCase } from './use-cases/get-all-specialities';
import { ISpecialitiesRepository } from './database/specialities.repository.interface';
import { SpecialitiesRepository } from './database/specialities.repository';
import { GetSpecialityByIdUseCase } from './use-cases/get-specialities-by-id';
import { SpecialitiesController } from './specialities.controller';
import { SpecialitiesDatabaseModule } from './database/specialities.database.module';

@Module({
  imports: [SpecialitiesDatabaseModule],
  controllers: [SpecialitiesController],
  providers: [
    {
      provide: GetAllSpecialitiesUseCase,
      useFactory: (servicesRepository: ISpecialitiesRepository) => {
        return new GetAllSpecialitiesUseCase(servicesRepository);
      },
      inject: [SpecialitiesRepository],
    },
    {
      provide: GetSpecialityByIdUseCase,
      useFactory: (servicesRepository: ISpecialitiesRepository) => {
        return new GetSpecialityByIdUseCase(servicesRepository);
      },
      inject: [SpecialitiesRepository],
    },
  ],
})
export class SpecialitiesModule {}
