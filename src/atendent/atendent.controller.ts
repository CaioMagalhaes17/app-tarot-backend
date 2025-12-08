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
import { CreateAtendentDTO } from './schema/create-atendent.schema';
import { UpdateAtendentUseCase } from './use-cases/update-atendent';

@Controller()
export class AtendentController {
  constructor(
    private getAtendentsUseCases: GetAtendentsUseCases,
    private getAtendentById: GetAtendentByIdUseCases,
    private createAtendentUseCase: CreateAtendentUseCase,
    private updateAtendentUseCase: UpdateAtendentUseCase,
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
    @Body() data: CreateAtendentDTO,
  ) {
    const result = await this.createAtendentUseCase.execute({
      userId: req.user.id,
      bio: data.bio,
      name: data.name,
      schedule: data.schedule,
    });

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/atendent')
  async putUpdateAtendent(
    @Req() req: { user: { id: string } },
    @Body() data: Partial<CreateAtendentDTO>,
  ) {
    const result = await this.updateAtendentUseCase.execute(req.user.id, data);
    return result;
  }
}
