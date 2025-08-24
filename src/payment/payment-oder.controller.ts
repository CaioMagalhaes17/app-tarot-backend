import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentOrderUseCase } from './use-cases/create-payment-order';
import { UserNotFound } from 'src/user/errors/UserNotFound';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { UpdatePaymentOrderUseCase } from './use-cases/update-payment-order';
import { PaymentOrderNotFound } from './error/PaymentOrderNotFound';
import { CreatePaymentIntentDto } from './schemas/create-payment-order.schema';

@Controller('payment-order')
export class PaymentOrderController {
  constructor(
    private createPaymentOrderUseCase: CreatePaymentOrderUseCase,
    private updatePaymentOrderUseCase: UpdatePaymentOrderUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPayment(
    @Body()
    paymentPayload: CreatePaymentIntentDto,
    @Req() req: { user: { id: string } },
  ) {
    const response = await this.createPaymentOrderUseCase.execute({
      amount: paymentPayload.amount,
      description: paymentPayload.description,
      userId: req.user.id,
      productType: paymentPayload.productType,
    });

    if (response.isLeft()) {
      switch (response.value.constructor) {
        case Error:
          throw new BadRequestException(response.value.message);
        case UserNotFound:
          throw new NotFoundException(response.value.message);
        default:
          throw new BadRequestException('Erro não tratado');
      }
    }

    return response.value;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':externalId')
  async updatePayment(@Param('externalId') externalId: string) {
    const response = await this.updatePaymentOrderUseCase.execute(externalId);
    console.log(response);
    if (response.isLeft()) {
      switch (response.value.constructor) {
        case Error:
          throw new BadRequestException(response.value.message);
        case UserNotFound:
          throw new NotFoundException(response.value.message);
        case PaymentOrderNotFound:
          throw new NotFoundException(response.value.message);
        default:
          throw new BadRequestException('Erro não tratado');
      }
    }
  }
}
