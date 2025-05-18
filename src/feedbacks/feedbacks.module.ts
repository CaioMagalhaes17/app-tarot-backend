import { Module } from '@nestjs/common';
import { FeedbacksDatabaseModule } from './database/feedbacks.module';
import { FeedbacksController } from './feedbacks.controller';
import { CreateFeedbackUseCase } from './use-cases/create-feedback';
import { IFeedbacksRepository } from './database/feedbacks.repository.interface';
import { FeedbacksRepository } from './database/feedbacks.repository';
import { DeleteFeedbackUseCase } from './use-cases/delete-feedback';
import { GetAllAtendentFeedbacksUseCase } from './use-cases/get-all-atendent-feedbacks';
import { GetAllSenderFeedbacksUseCase } from './use-cases/get-all-sender-feedbacks';

@Module({
  imports: [FeedbacksDatabaseModule],
  controllers: [FeedbacksController],
  providers: [
    {
      provide: CreateFeedbackUseCase,
      useFactory: (feedbackRepository: IFeedbacksRepository) => {
        return new CreateFeedbackUseCase(feedbackRepository);
      },
      inject: [FeedbacksRepository],
    },
    {
      provide: DeleteFeedbackUseCase,
      useFactory: (feedbackRepository: IFeedbacksRepository) => {
        return new DeleteFeedbackUseCase(feedbackRepository);
      },
      inject: [FeedbacksRepository],
    },
    {
      provide: GetAllAtendentFeedbacksUseCase,
      useFactory: (feedbackRepository: IFeedbacksRepository) => {
        return new GetAllAtendentFeedbacksUseCase(feedbackRepository);
      },
      inject: [FeedbacksRepository],
    },
    {
      provide: GetAllSenderFeedbacksUseCase,
      useFactory: (feedbackRepository: IFeedbacksRepository) => {
        return new GetAllSenderFeedbacksUseCase(feedbackRepository);
      },
      inject: [FeedbacksRepository],
    },
  ],
})
export class FeedbacksModule {}
