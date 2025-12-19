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
import { AtendentPresenter } from './atendent.presenter';

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
    @Query('service') service: string,
    @Query('search') search: string,
  ) {
    console.log(search);
    const result = await this.getAtendentsUseCases.execute(
      { service, search },
      { limit, page },
    );
    return {
      data: result.data.map((item) => AtendentPresenter.toHttp(item)),
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    };
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
    return AtendentPresenter.toHttp(result.value);
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
