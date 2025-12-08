import { Module } from '@nestjs/common';
import { AtendentController } from './atendent.controller';
import { AtendentDatabaseModule } from './database/atendent.database.module';
import { GetAtendentsUseCases } from './use-cases/get-atendents';
import { IAtendentRepository } from './database/atendent.repository.interface';
import { AtendentRepository } from './database/atendent.repository';
import { GetAtendentByIdUseCases } from './use-cases/get-atendent-by-id';
import { CreateAtendentUseCase } from './use-cases/create-atendent';
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { UserRepository } from 'src/user/database/user.repository';
import { UserDatabaseModule } from 'src/user/database/user.database.module';
import { UpdateAtendentUseCase } from './use-cases/update-atendent';

@Module({
  imports: [AtendentDatabaseModule, UserDatabaseModule],
  controllers: [AtendentController],
  providers: [
    {
      provide: GetAtendentsUseCases,
      useFactory: (servicesRepository: IAtendentRepository) => {
        return new GetAtendentsUseCases(servicesRepository);
      },
      inject: [AtendentRepository],
    },
    {
      provide: GetAtendentByIdUseCases,
      useFactory: (servicesRepository: IAtendentRepository) => {
        return new GetAtendentByIdUseCases(servicesRepository);
      },
      inject: [AtendentRepository],
    },
    {
      provide: CreateAtendentUseCase,
      useFactory: (
        servicesRepository: IAtendentRepository,
        userRepository: IUserRepository,
      ) => {
        return new CreateAtendentUseCase(servicesRepository, userRepository);
      },
      inject: [AtendentRepository, UserRepository],
    },
    {
      provide: UpdateAtendentUseCase,
      useFactory: (servicesRepository: IAtendentRepository) => {
        return new UpdateAtendentUseCase(servicesRepository);
      },
      inject: [AtendentRepository],
    },
  ],
})
export class AtendentModule {}
