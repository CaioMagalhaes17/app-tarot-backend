import { IUserRepository } from 'src/user/database/user.repository.interface';
import { AtendentEntity, Schedule } from '../atendent.entity';
import { IAtendentRepository } from '../database/atendent.repository.interface';

type CreateAtendentUseCaseRequest = {
  bio: string;
  name: string;
  userId: string;
  schedule: Schedule;
};
export class CreateAtendentUseCase {
  constructor(
    private atendentRepository: IAtendentRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(props: CreateAtendentUseCaseRequest) {
    const user = await this.userRepository.findById(props.userId);
    const atendent = AtendentEntity.create({
      bio: props.bio,
      name: props.name,
      rating: 0,
      schedule: props.schedule,
      user,
    });
    await this.atendentRepository.create(atendent);
  }
}
