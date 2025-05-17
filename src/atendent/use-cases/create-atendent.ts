import { Either, left, right } from 'src/core/Either';
import { IAtendentRepository } from '../database/atendent.repository.interface';
import { AtendentAlreadyExists } from '../errors/AtendentAlreadyExists';

type CreateAtendentUseCaseProps = {
  specialities: string[];
  userId: string;
};

type CreateAtendentUseCaseResponse = Either<
  AtendentAlreadyExists,
  { id: string }
>;
export class CreateAtendentUseCase {
  constructor(private atendentRepository: IAtendentRepository) {}

  async execute(
    data: CreateAtendentUseCaseProps,
  ): Promise<CreateAtendentUseCaseResponse> {
    const atendent = await this.atendentRepository.findByParam<{
      userId: string;
    }>({ userId: data.userId });
    if (atendent.length > 0) return left(new AtendentAlreadyExists());
    const result = await this.atendentRepository.create(data);
    return right(result);
  }
}
