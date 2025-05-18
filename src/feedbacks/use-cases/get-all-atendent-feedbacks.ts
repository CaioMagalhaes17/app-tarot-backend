import { IFeedbacksRepository } from '../database/feedbacks.repository.interface';

export class GetAllAtendentFeedbacksUseCase {
  constructor(private feedbackRepository: IFeedbacksRepository) {}

  async execute(id: string) {
    return await this.feedbackRepository.findByParam<{ atendentId: string }>({
      atendentId: id,
    });
  }
}
