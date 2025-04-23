import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserLoginUseCase } from './use-cases/login-use-case';

@Controller()
export class UserController {
  constructor(private userLogin: UserLoginUseCase) {}

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
        case BadRequestException:
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
