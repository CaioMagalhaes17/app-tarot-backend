import { IFeedbacksRepository } from '../database/feedbacks.repository.interface';
import { Either, left, right } from 'src/core/Either';
import { FeedbackNotFound } from '../error/FeedbackNotFound';
import { FeedbackActionNotAllowed } from '../error/FeedbackActionNotAllowed';

type DeleteFeedbackUseCaseResponse = Either<
  FeedbackNotFound | FeedbackActionNotAllowed,
  void
>;
export class DeleteFeedbackUseCase {
  constructor(private feedbacksRepository: IFeedbacksRepository) {}

  async execute(
    userId: string,
    feedbackId: string,
  ): Promise<DeleteFeedbackUseCaseResponse> {
    const feedback = await this.feedbacksRepository.findById(feedbackId);
    if (!feedback) return left(new FeedbackNotFound());
    if (feedback.senderId !== userId)
      return left(new FeedbackActionNotAllowed());

    return right(await this.feedbacksRepository.deleteById(feedbackId));
  }
}
