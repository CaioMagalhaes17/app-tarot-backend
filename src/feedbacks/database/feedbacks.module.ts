import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedbacks, FeedbacksSchema } from './feedbacks.schema';
import { FeedbacksMapper } from './feedbacks.mapper';
import { FeedbacksRepository } from './feedbacks.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedbacks.name, schema: FeedbacksSchema },
    ]),
  ],
  providers: [
    FeedbacksMapper,
    {
      provide: FeedbacksRepository,
      useFactory: (model: Model<Feedbacks>, mapper: FeedbacksMapper) => {
        return new FeedbacksRepository(model, mapper);
      },
      inject: [getModelToken(Feedbacks.name), FeedbacksMapper],
    },
  ],
  exports: [FeedbacksRepository],
})
export class FeedbacksDatabaseModule {}
