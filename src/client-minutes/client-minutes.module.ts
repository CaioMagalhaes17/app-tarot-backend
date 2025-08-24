import { Module } from '@nestjs/common';
import { ClientMinutesRepository } from './database/client-minutes.repository';
import { IClientMinutesRepository } from './database/client-minutes.repository.interface';
import { FetchClientMinutes } from './use-cases/fetch-client-minutes';
import { ClientMinutesController } from './client-minutes.controller';
import { ClientMinutesDatabaseModule } from './database/client-minutes.module';
import { UserDatabaseModule } from 'src/user/database/user.database.module';
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { UserRepository } from 'src/user/database/user.repository';
import { CreateMinutesTransaction } from './use-cases/create-minutes-transaction';
import { IPaymentOrderRepository } from 'src/payment/database/payment-order.repository.interface';
import { PaymentOrderRepository } from 'src/payment/database/payment-order.repository';
import { PaymentOrderDatabaseModule } from 'src/payment/database/payment-oder.module';
import { UpdateMinutesTransactionUseCase } from './use-cases/update-minutes-transaction';

@Module({
  imports: [
    ClientMinutesDatabaseModule,
    UserDatabaseModule,
    PaymentOrderDatabaseModule,
  ],
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
      provide: UpdateMinutesTransactionUseCase,
      useFactory: (
        clientMinutesRepository: IClientMinutesRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        userRepository: IUserRepository,
      ) => {
        return new UpdateMinutesTransactionUseCase(
          clientMinutesRepository,
          paymentOrderRepository,
          userRepository,
        );
      },
      inject: [ClientMinutesRepository, PaymentOrderRepository, UserRepository],
    },
    {
      provide: CreateMinutesTransaction,
      useFactory: (
        clientMinutesRepository: IClientMinutesRepository,
        userRepository: IUserRepository,
        paymentOrderRepository: IPaymentOrderRepository,
      ) => {
        return new CreateMinutesTransaction(
          clientMinutesRepository,
          userRepository,
          paymentOrderRepository,
        );
      },
      inject: [ClientMinutesRepository, UserRepository, PaymentOrderRepository],
    },
  ],
})
export class ClientMinutesModule {}
