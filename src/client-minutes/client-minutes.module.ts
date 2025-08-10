import { Module } from '@nestjs/common';
import { ClientMinutesRepository } from './database/client-minutes.repository';
import { IClientMinutesRepository } from './database/client-minutes.repository.interface';
import { FetchClientMinutes } from './use-cases/fetch-client-minutes';
import { ClientMinutesController } from './client-minutes.controller';
import { ClientMinutesDatabaseModule } from './database/client-minutes.module';
import { UserDatabaseModule } from 'src/user/database/user.database.module';
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { UserRepository } from 'src/user/database/user.repository';
import { AddPurchaseMinutesUseCase } from './use-cases/add-purchase-minutes';

@Module({
  imports: [ClientMinutesDatabaseModule, UserDatabaseModule],
  controllers: [ClientMinutesController],
  providers: [
    {
      provide: FetchClientMinutes,
      useFactory: (
        clientMinutesRepository: IClientMinutesRepository,
        userRepository: IUserRepository,
      ) => {
        return new FetchClientMinutes(clientMinutesRepository, userRepository);
      },
      inject: [ClientMinutesRepository, UserRepository],
    },
    {
      provide: AddPurchaseMinutesUseCase,
      useFactory: (
        clientMinutesRepository: IClientMinutesRepository,
        userRepository: IUserRepository,
      ) => {
        return new AddPurchaseMinutesUseCase(
          clientMinutesRepository,
          userRepository,
        );
      },
      inject: [ClientMinutesRepository, UserRepository],
    },
  ],
})
export class ClientMinutesModule {}
