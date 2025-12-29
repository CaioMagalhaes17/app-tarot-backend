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
import { GetUserUseCase } from './use-cases/get-user-use-case';
import { IAtendentRepository } from 'src/atendent/database/atendent.repository.interface';
import { AtendentRepository } from 'src/atendent/database/atendent.repository';
import { AtendentDatabaseModule } from 'src/atendent/database/atendent.database.module';
import { GoogleAuthService } from './google-auth.service';
import {
  GoogleLoginUseCase,
  IGoogleAuthService,
} from './use-cases/login-google';

@Module({
  imports: [
    CryptographyModule,
    AuthModule,
    UserDatabaseModule,
    EmailModule,
    AuthModule,
    AtendentDatabaseModule,
  ],
  controllers: [UserController],
  providers: [
    GoogleAuthService,
    {
      provide: GoogleLoginUseCase,
      useFactory: (
        userRepository: IUserRepository,
        encrypterGateway: EncrypterGateway,
        googleAuthService: IGoogleAuthService,
      ) => {
        return new GoogleLoginUseCase(
          userRepository,
          encrypterGateway,
          googleAuthService,
        );
      },
      inject: [UserRepository, EncrypterGateway, GoogleAuthService],
    },
    {
      provide: GetUserUseCase,
      useFactory: (
        userRepository: IUserRepository,
        atendentRepository: IAtendentRepository,
      ) => {
        return new GetUserUseCase(userRepository, atendentRepository);
      },
      inject: [UserRepository, AtendentRepository],
    },
    {
      provide: UserLoginUseCase,
      useFactory: (
        userRepository: IUserRepository,
        encrypterGateway: EncrypterGateway,
        atendentRepository: IAtendentRepository,
      ) => {
        return new UserLoginUseCase(
          userRepository,
          encrypterGateway,
          atendentRepository,
        );
      },
      inject: [UserRepository, EncrypterGateway, AtendentRepository],
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
