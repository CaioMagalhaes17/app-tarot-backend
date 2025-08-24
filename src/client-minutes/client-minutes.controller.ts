import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { FetchClientMinutes } from './use-cases/fetch-client-minutes';
import { UserNotFound } from 'src/user/errors/UserNotFound';
import { CreateMinutesTransactionDto } from './schema/create-minutes-transaction';
import { CreateMinutesTransaction } from './use-cases/create-minutes-transaction';

@Controller('/client-minutes')
export class ClientMinutesController {
  constructor(
    private createMinutesTransaction: CreateMinutesTransaction,
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
  @Post('/minutes-transaction')
  async addMinutes(
    @Body() transactionPayload: CreateMinutesTransactionDto,
    @Req() req: { user: { id: string } },
  ) {
    const response = await this.createMinutesTransaction.execute(
      req.user.id,
      transactionPayload.minutes,
      transactionPayload.paymentOrderId,
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
