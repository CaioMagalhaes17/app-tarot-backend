import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserLoginUseCase } from './use-cases/login-use-case';
import { UserSignupUseCase } from './use-cases/signup-use-case';
import { LoginAlreadyExists } from './errors/LoginAlreadyExists';
import { InvalidLoginError } from './errors/InvalidLogin';
import { SendEmailVerificationUseCase } from './use-cases/send-email-verification-use-case';
import { VerifyTokenUseCase } from './use-cases/verify-token-use-case';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { GetUserUseCase } from './use-cases/get-user-use-case';
import { UserNotFound } from './errors/UserNotFound';
import { UserPresenter } from './user.presenter';

@Controller()
export class UserController {
  constructor(
    private userLogin: UserLoginUseCase,
    private userSignup: UserSignupUseCase,
    private sendEmailVerificationUseCase: SendEmailVerificationUseCase,
    private verifyTokenUseCase: VerifyTokenUseCase,
    private getUserUseCase: GetUserUseCase,
  ) {}

  @Post('/user/login')
  async login(
    @Body()
    loginData: {
      login: string;
      password: string;
      isAtendent: boolean;
    },
  ) {
    const response = await this.userLogin.execute(loginData);

    if (response.isLeft()) {
      switch (response.value.constructor) {
        case InvalidLoginError:
          throw new BadRequestException(response.value.message);
        default:
          throw new BadRequestException();
      }
    }

    const { token, user } = response.value;

    const userInfos = {
      id: user.id,
      name: user.name,
      isVerified: user.isVerified,
    };

    return {
      token,
      userInfos,
    };
  }

  @Post('/user/signup')
  async signup(
    @Body()
    signupData: {
      login: string;
      password: string;
      name: string;
      isAtendent: boolean;
      permission: 'user';
    },
  ) {
    const response = await this.userSignup.execute(signupData);

    if (response.isLeft()) {
      switch (response.value.constructor) {
        case LoginAlreadyExists:
          throw new BadRequestException(response.value.message);
        default:
          throw new BadRequestException();
      }
    }

    const { token, user } = response.value;

    const userInfos = {
      id: user.id,
      name: user.name,
      isVerified: user.isVerified,
    };

    return {
      token,
      userInfos,
    };
  }

  @Post('/user/sendVerifyEmail')
  async sendEmail(
    @Body()
    body: {
      name: string;
      email: string;
    },
  ) {
    await this.sendEmailVerificationUseCase.execute(body.name, body.email);
  }

  @Get('/user/verifyEmail/:token')
  async verifyEmail(@Param('token') token: string) {
    const response = await this.verifyTokenUseCase.execute(token);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getUser(@Req() req: { user: { id: string } }) {
    const response = await this.getUserUseCase.execute(req.user.id);
    if (response.isLeft()) {
      switch (response.value.constructor) {
        case UserNotFound:
          throw new NotFoundException(response.value.message);
        default:
          throw new BadRequestException('Erro não tratado');
      }
    }
    return UserPresenter.toHttp(response.value.user, false, response.value.atendent);
  }
}
