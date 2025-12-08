import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChooseServicesUseCase } from './use-cases/choose-services';
import { ExcludeServiceUseCase } from './use-cases/exclude-service';
import { FetchAllAtendentServices } from './use-cases/fetch-all-atendent-services';
import { FetchAtendentServiceByIdUseCase } from './use-cases/fetch-atendent-services-by-id';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';

@Controller('atendent-service')
export class AtendentServicesController {
  constructor(
    private chooseServicesUseCase: ChooseServicesUseCase,
    private excludeServiceUseCase: ExcludeServiceUseCase,
    private fetchAllAtendentServices: FetchAllAtendentServices,
    private fetchAtendentServiceById: FetchAtendentServiceByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('choose')
  async chooseServices(
    @Req() req: { user: { id: string } },
    @Body()
    data: {
      services: {
        id: string;
        customDescription: string;
        price: number;
      }[];
    },
  ) {
    const response = await this.chooseServicesUseCase.execute({
      atendentId: req.user.id,
      services: data.services,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('exclude/:id')
  async exclude(@Param('id') id: string) {
    const response = await this.excludeServiceUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async fetchAll() {
    const response = await this.fetchAllAtendentServices.execute();
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('id')
  async fetchById(@Param('id') id: string) {
    const response = await this.fetchAtendentServiceById.execute(id);
    return response;
  }
}
