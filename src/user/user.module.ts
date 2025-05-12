import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CryptographyModule } from 'src/infra/auth/cryptography/cryptography.module';
import { AuthModule } from 'src/infra/auth/auth.module';
import { UserLoginUseCase } from './use-cases/login-use-case';
import { UserRepository } from './database/user.repository';
import { EncrypterGateway } from 'src/infra/auth/cryptography/encrypter.interface';
import { UserSignupUseCase } from './use-cases/signup-use-case';
import { UserDatabaseModule } from './database/user.database.module';
import { SendEmailVerificationUseCase } from './use-cases/send-email-verification-use-case';
import { EmailModule } from 'src/email/email.module';
import { EmailGateway } from 'src/email/email.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyTokenUseCase } from './use-cases/verify-token-use-case';
import { IUserRepository } from './database/user.repository.interface';

@Module({
  imports: [
    CryptographyModule,
    AuthModule,
    UserDatabaseModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserLoginUseCase,
      useFactory: (
        userRepository: IUserRepository,
        encrypterGateway: EncrypterGateway,
      ) => {
        return new UserLoginUseCase(userRepository, encrypterGateway);
      },
      inject: [UserRepository, EncrypterGateway],
    },
    {
      provide: UserSignupUseCase,
      useFactory: (
        userRepository: IUserRepository,
        encrypterGateway: EncrypterGateway,
      ) => {
        return new UserSignupUseCase(userRepository, encrypterGateway);
      },
      inject: [UserRepository, EncrypterGateway],
    },
    {
      provide: SendEmailVerificationUseCase,
      useFactory: (
        emailGateway: EmailGateway,
        jwtService: JwtService,
        configService: ConfigService,
      ) => {
        return new SendEmailVerificationUseCase(
          emailGateway,
          jwtService,
          configService,
        );
      },
      inject: [EmailGateway, JwtService, ConfigService],
    },
    {
      provide: VerifyTokenUseCase,
      useFactory: (userRepository: IUserRepository, jwtService: JwtService) => {
        return new VerifyTokenUseCase(userRepository, jwtService);
      },
      inject: [UserRepository, JwtService],
    },
  ],
})
export class UserModule {}
