import { FeedbacksEntity } from './feedbacks.entity';

export class FeedbacksPresenter {
  static toHttp(feedbacks: FeedbacksEntity) {
    return {
      id: feedbacks.id,
      description: feedbacks.description,
      rating: feedbacks.rating,
      createdAt: feedbacks.createdAt,
      senderId: feedbacks.senderId,
      atendentId: feedbacks.atendentId,
    };
  }
}
