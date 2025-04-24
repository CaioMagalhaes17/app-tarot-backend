import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserLoginUseCase } from './use-cases/login-use-case';
import { UserSignupUseCase } from './use-cases/signup-use-case';
import { LoginAlreadyExists } from './errors/LoginAlreadyExists';
import { InvalidLoginError } from './errors/InvalidLogin';

@Controller()
export class UserController {
  constructor(
    private userLogin: UserLoginUseCase,
    private userSignup: UserSignupUseCase,
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
    };

    return {
      token,
      userInfos,
    };
  }
}
