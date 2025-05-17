import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetAtendentsUseCases } from './use-cases/get-atendents';
import { GetAtendentByIdUseCases } from './use-cases/get-atendent-by-id';
import { AtendentNotFound } from './errors/AtendentNotFound';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { CreateAtendentUseCase } from './use-cases/create-atendent';
import { AtendentAlreadyExists } from './errors/AtendentAlreadyExists';
import { AtendentEntity } from './atendent.entity';
import { UpdateAtendentUseCase } from './use-cases/update-atendent';

@Controller()
export class AtendentController {
  constructor(
    private getAtendentsUseCases: GetAtendentsUseCases,
    private getAtendentById: GetAtendentByIdUseCases,
    private createAtendent: CreateAtendentUseCase,
    private updateAtendent: UpdateAtendentUseCase,
  ) {}

  @Get('/atendent')
  async getAtendents(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const result = await this.getAtendentsUseCases.execute({ limit, page });
    return result;
  }

  @Get('/atendent/:id')
  async fetchAtendentById(@Param('id') id: string) {
    const result = await this.getAtendentById.execute(id);
    if (result.isLeft()) {
      switch (result.value.constructor) {
        case AtendentNotFound:
          throw new NotFoundException(result.value.message);
        default:
          throw new BadRequestException('Erro não tratado');
      }
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/atendent')
  async postCreateAtendent(
    @Req() req: { user: { id: string } },
    @Body() data: { specialities: string[] },
  ) {
    const result = await this.createAtendent.execute({
      specialities: data.specialities,
      userId: req.user.id,
    });

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case AtendentAlreadyExists:
          throw new BadRequestException(result.value.message);
        default:
          throw new BadRequestException('Erro não tratado');
      }
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/atendent/:id')
  async putUpdateAtendent(
    @Req() req: { user: { id: string } },
    @Body() data: Partial<AtendentEntity>,
  ) {
    const result = await this.updateAtendent.execute(req.user.id, data);

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case AtendentNotFound:
          throw new BadRequestException(result.value.message);
        default:
          throw new BadRequestException('Erro não tratado');
      }
    }

    return result;
  }
}
