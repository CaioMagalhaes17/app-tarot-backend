import { IFeedbacksRepository } from '../database/feedbacks.repository.interface';

export class GetAllSenderFeedbacksUseCase {
  constructor(private feedbacksRepository: IFeedbacksRepository) {}

  async execute(userId: string) {
    return this.feedbacksRepository.findByParam<{ senderId: string }>({
      senderId: userId,
    });
  }
}
