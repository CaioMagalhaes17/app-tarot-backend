import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChooseServicesUseCase } from './use-cases/choose-services';
import { ExcludeServiceUseCase } from './use-cases/exclude-service';
import { FetchAtendentServiceByIdUseCase } from './use-cases/fetch-atendent-services-by-id';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { FetchAtendentServices } from './use-cases/fetch-all-atendent-services';
import { FetchAllAtendentServicesByService } from './use-cases/fetch-all-atendent-services-by-service';
import { UpdateAtendentServiceUseCase } from './use-cases/update-service';

@Controller('atendent-service')
export class AtendentServicesController {
  constructor(
    private chooseServicesUseCase: ChooseServicesUseCase,
    private excludeServiceUseCase: ExcludeServiceUseCase,
    private fetchAtendentServiceById: FetchAtendentServiceByIdUseCase,
    private fetchAtendentServicesUseCase: FetchAtendentServices,
    private fetchAllAtendentServicesByService: FetchAllAtendentServicesByService,
    private updateServiceUseCase: UpdateAtendentServiceUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('choose')
  async chooseServices(
    @Req() req: { user: { id: string; atendentId: string } },
    @Body()
    data: {
      id: string;
      customDescription: string;
      price: number;
    }[],
  ) {
    console.log(new Date());
    const response = await this.chooseServicesUseCase.execute({
      atendentId: req.user.atendentId,
      services: data,
    });

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('exclude/:id')
  async exclude(@Param('id') id: string) {
    const response = await this.excludeServiceUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { description?: string; price?: number },
  ) {
    const response = await this.updateServiceUseCase.execute(id, data);
    if (response.isLeft()) {
      throw new BadRequestException(response.value.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-atendent/:id')
  async fetchAtendentServices(@Param('id') id: string) {
    const response = await this.fetchAtendentServicesUseCase.execute(id);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async fetchById(@Param('id') id: string) {
    const response = await this.fetchAtendentServiceById.execute(id);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-service/:id')
  async fetchByService(@Param('id') id: string) {
    const response = await this.fetchAllAtendentServicesByService.execute(id);
    return response;
  }
}
