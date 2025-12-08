import { Schedule } from '../atendent.entity';
import { IAtendentRepository } from '../database/atendent.repository.interface';

type UpdateAtendentUseCaseRequest = {
  bio?: string;
  name?: string;
  schedule?: Schedule;
};
export class UpdateAtendentUseCase {
  constructor(private atendentRepository: IAtendentRepository) {}

  async execute(userId: string, props: UpdateAtendentUseCaseRequest) {
    const atendent = await this.atendentRepository.findByUserId(userId);
    if (!atendent) return;
    atendent.update(props);
    await this.atendentRepository.updateById(atendent.id.toString(), atendent);
  }
}
