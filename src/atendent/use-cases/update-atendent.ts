import { Either, left, right } from 'src/core/Either';
import { IAtendentRepository } from '../database/atendent.repository.interface';
import { AtendentNotFound } from '../errors/AtendentNotFound';
import { AtendentEntity } from '../atendent.entity';

type UpdateAtendentUseCaseResponse = Either<AtendentNotFound, null>;
export class UpdateAtendentUseCase {
  constructor(private atendentRepository: IAtendentRepository) {}

  async execute(
    userId: string,
    data: Partial<AtendentEntity>,
  ): Promise<UpdateAtendentUseCaseResponse> {
    const atendent = await this.atendentRepository.findByParam<{
      userId: string;
    }>({ userId });
    if (!atendent || atendent.length === 0) return left(new AtendentNotFound());
    atendent[0].update(data);
    await this.atendentRepository.updateById(
      atendent[0].id.toString(),
      atendent[0],
    );
    return right(null);
  }
}
