import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateFeedbackUseCase } from './use-cases/create-feedback';
import { DeleteFeedbackUseCase } from './use-cases/delete-feedback';
import { GetAllAtendentFeedbacksUseCase } from './use-cases/get-all-atendent-feedbacks';
import { GetAllSenderFeedbacksUseCase } from './use-cases/get-all-sender-feedbacks';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt.guard';
import { FeedbackNotFound } from './error/FeedbackNotFound';
import { FeedbackActionNotAllowed } from './error/FeedbackActionNotAllowed';
import { FeedbacksPresenter } from './feedbacks.presenter';

@Controller()
export class FeedbacksController {
  constructor(
    private createFeedbackUseCase: CreateFeedbackUseCase,
    private deleteFeedbackUseCase: DeleteFeedbackUseCase,
    private getAllAtendentFeedbacksUseCase: GetAllAtendentFeedbacksUseCase,
    private getAllSenderFeedbacksUseCase: GetAllSenderFeedbacksUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/feedbacks')
  async getSenderFeedbacks(@Req() req: { user: { id: string } }) {
    const response = await this.getAllSenderFeedbacksUseCase.execute(
      req.user.id,
    );
    return response.map((item) => FeedbacksPresenter.toHttp(item));
  }

  @Get('/feedbacks/atendent/:atendentId')
  async getAtendentFeedbacks(@Param('atendentId') atendentId: string) {
    const response =
      await this.getAllAtendentFeedbacksUseCase.execute(atendentId);

    return response.map((item) => FeedbacksPresenter.toHttp(item));
  }

  @UseGuards(JwtAuthGuard)
  @Post('/feedbacks/:atendentId')
  async createFeedback(
    @Req() req: { user: { id: string } },
    @Param('atendentId') atendentId: string,
    @Body()
    body: {
      description: string;
      rating: number;
    },
  ) {
    const response = await this.createFeedbackUseCase.execute({
      atendentId,
      description: body.description,
      rating: body.rating,
      userId: req.user.id,
    });
    return response;
    //return ServicesPresenter.toHttp(response);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/feedbacks/:feedbackId')
  async deleteFeedback(
    @Req() req: { user: { id: string } },
    @Param('feedbackId') feedbackId: string,
  ) {
    const result = await this.deleteFeedbackUseCase.execute(
      req.user.id,
      feedbackId,
    );
    if (result.isLeft()) {
      switch (result.value.constructor) {
        case FeedbackNotFound:
          throw new NotFoundException(result.value.message);
        case FeedbackActionNotAllowed:
          throw new BadRequestException(result.value.message);
        default:
          throw new BadRequestException('Erro não tratado');
      }
    }

    return result;
  }
}
