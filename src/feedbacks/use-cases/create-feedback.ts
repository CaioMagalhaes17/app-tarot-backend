import { IFeedbacksRepository } from '../database/feedbacks.repository.interface';

export class CreateFeedbackUseCase {
  constructor(private feedbacksRepository: IFeedbacksRepository) {}

  async execute({
    userId,
    atendentId,
    description,
    rating,
  }: {
    userId: string;
    atendentId: string;
    description: string;
    rating: number;
  }) {
    const result = await this.feedbacksRepository.create({
      senderId: userId,
      atendentId,
      description,
      rating,
    });

    return result;
  }
}
