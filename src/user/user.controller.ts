import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserLoginUseCase } from './use-cases/login-use-case';
import { UserSignupUseCase } from './use-cases/signup-use-case';
import { LoginAlreadyExists } from './errors/LoginAlreadyExists';
import { InvalidLoginError } from './errors/InvalidLogin';
import { SendEmailVerificationUseCase } from './use-cases/send-email-verification-use-case';
import { VerifyTokenUseCase } from './use-cases/verify-token-use-case';

@Controller()
export class UserController {
  constructor(
    private userLogin: UserLoginUseCase,
    private userSignup: UserSignupUseCase,
    private sendEmailVerificationUseCase: SendEmailVerificationUseCase,
    private verifyTokenUseCase: VerifyTokenUseCase,
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

  @Post('/user/verifyEmail')
  async verifyEmail(
    @Body()
    body: {
      token: string;
    },
  ) {
    const response = await this.verifyTokenUseCase.execute(body.token);
    console.log(response);
    return response;
  }
}
