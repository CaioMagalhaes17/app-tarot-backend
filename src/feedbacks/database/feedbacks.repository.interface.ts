import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { FeedbacksEntity } from '../feedbacks.entity';

export interface IFeedbacksRepository
  extends BaseDomainRepository<FeedbacksEntity> {}
