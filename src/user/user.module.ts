import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CryptographyModule } from 'src/infra/auth/cryptography/cryptography.module';
import { AuthModule } from 'src/infra/auth/auth.module';
import { UserLoginUseCase } from './use-cases/login-use-case';
import { UserRepository } from './database/user.repository';
import { EncrypterGateway } from 'src/infra/auth/cryptography/encrypter.interface';
import { UserSignupUseCase } from './use-cases/signup-use-case';
import { UserDatabaseModule } from './database/user.database.module';

@Module({
  imports: [CryptographyModule, AuthModule, UserDatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: UserLoginUseCase,
      useFactory: (
        userRepository: UserRepository,
        encrypterGateway: EncrypterGateway,
      ) => {
        return new UserLoginUseCase(userRepository, encrypterGateway);
      },
      inject: [UserRepository, EncrypterGateway],
    },
    {
      provide: UserSignupUseCase,
      useFactory: (
        userRepository: UserRepository,
        encrypterGateway: EncrypterGateway,
      ) => {
        return new UserSignupUseCase(userRepository, encrypterGateway);
      },
      inject: [UserRepository, EncrypterGateway],
    },
  ],
})
export class UserModule {}
