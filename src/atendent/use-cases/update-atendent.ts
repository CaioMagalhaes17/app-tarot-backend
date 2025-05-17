import { Either, left, right } from 'src/core/Either';
import { IAtendentRepository } from '../database/atendent.repository.interface';
import { AtendentNotFound } from '../errors/AtendentNotFound';
import { AtendentEntity } from '../atendent.entity';

type UpdateAtendentUseCaseResponse = Either<AtendentNotFound, { id: string }>;
export class UpdateAtendentUseCase {
  constructor(private atendentRepository: IAtendentRepository) {}

  async execute(
    userId: string,
    data: Partial<AtendentEntity>,
  ): Promise<UpdateAtendentUseCaseResponse> {
    const atendent = await this.atendentRepository.findByParam<{
      userId: string;
    }>({ userId });
    if (!atendent) return left(new AtendentNotFound());
    const result = await this.atendentRepository.updateById(
      atendent[0].id,
      data,
    );
    return right(result);
  }
}
