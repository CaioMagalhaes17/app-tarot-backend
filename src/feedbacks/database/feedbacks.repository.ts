import { BaseInfraRepository } from 'src/core/base.repository';
import { Model } from 'mongoose';
import { Feedbacks } from './feedbacks.schema';
import { FeedbacksEntity } from '../feedbacks.entity';
import { FeedbacksMapper } from './feedbacks.mapper';

export class FeedbacksRepository extends BaseInfraRepository<
  Feedbacks,
  FeedbacksEntity
> {
  constructor(
    protected readonly model: Model<Feedbacks>,
    protected readonly mapper: FeedbacksMapper,
  ) {
    super(model, mapper);
  }
}
