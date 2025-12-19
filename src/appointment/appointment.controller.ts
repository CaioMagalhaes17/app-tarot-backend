import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FetchAllAppointmentsByAtendent } from './use-cases/fetch-all-appointments-by-atendent';
import { FetchAllAppointmentsByUser } from './use-cases/fetch-all-appointments-by-user';
import { ScheduleAppointmentUseCase } from './use-cases/schedule-appointment';
import { UpdateAppointmentUseCase } from './use-cases/update-appointment';
import { ScheduleAppointmentDTO } from './schemas/schedule-appointment';
import { UpdateAppointmentDTO } from './schemas/update-appiontment';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { CreateAppointmentPaymentOrderUseCase } from './use-cases/create-appointment-payment-order';
import { CreateAppointmentPaymentDTO } from './schemas/create-appointment-payment.schema';

@Controller('appointment')
export class AppointmentController {
  constructor(
    private fetchAllAppointmentsByAtendentUseCase: FetchAllAppointmentsByAtendent,
    private fetchAllAppointmentsByUserUseCase: FetchAllAppointmentsByUser,
    private scheduleAppointmentUseCase: ScheduleAppointmentUseCase,
    private updateAppointmentUseCase: UpdateAppointmentUseCase,
    private createAppointmentPaymentOrderUseCase: CreateAppointmentPaymentOrderUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('schedule')
  async scheduleAppointment(
    @Body() data: ScheduleAppointmentDTO,
    @Req() req: { user: { id: string } },
  ) {
    const response = await this.scheduleAppointmentUseCase.execute({
      userId: req.user.id,
      ...data,
    });
    if (response.isLeft()) {
      throw new BadRequestException(response.value.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('payment')
  async createAppointmentPayment(
    @Body() data: CreateAppointmentPaymentDTO,
    @Req() req: { user: { id: string } },
  ) {
    const response = await this.createAppointmentPaymentOrderUseCase.execute({
      userId: req.user.id,
      atendentServiceId: data.atendentServiceId,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
    });

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message);
    }

    return response.value;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAppointment(
    @Body() data: UpdateAppointmentDTO,
    @Param('id') id: string,
  ) {
    const response = await this.updateAppointmentUseCase.execute(id, data);
    if (response.isLeft()) {
      throw new BadRequestException(response.value.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-user')
  async fetchAllAppointmentsByUser(@Req() req: { user: { id: string } }) {
    const result = await this.fetchAllAppointmentsByUserUseCase.execute(
      req.user.id,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-atendent/:id')
  async fetchAllAppointmentsByAtendent(@Param('id') id: string) {
    const result = await this.fetchAllAppointmentsByAtendentUseCase.execute(id);
    return result;
  }
}
