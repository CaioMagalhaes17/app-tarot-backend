import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddPurchaseMinutesUseCase } from './use-cases/add-purchase-minutes';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { FetchClientMinutes } from './use-cases/fetch-client-minutes';
import { UserNotFound } from 'src/user/errors/UserNotFound';

@Controller('/client-minutes')
export class ClientMinutesController {
  constructor(
    private addPurchaseMinutes: AddPurchaseMinutesUseCase,
    private fetchClientMinutesUseCase: FetchClientMinutes,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async fetchClientMinutes(@Req() req: { user: { id: string } }) {
    const response = await this.fetchClientMinutesUseCase.execute(req.user.id);
    if (response.isLeft()) {
      switch (response.value.constructor) {
        case UserNotFound:
          return new BadRequestException(response.value.message);
        default:
          return new BadRequestException('Erro não tratado');
      }
    }
    return response.value;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/purchase')
  async addMinutes(
    @Query('minutes') minutes: string,
    @Req() req: { user: { id: string } },
  ) {
    const response = await this.addPurchaseMinutes.execute(
      req.user.id,
      Number(minutes),
    );
    if (response.isLeft()) {
      switch (response.value.constructor) {
        case UserNotFound:
          return new BadRequestException(response.value.message);
        default:
          return new BadRequestException('Erro não tratado');
      }
    }
  }
}
