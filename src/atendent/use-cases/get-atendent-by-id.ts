import { Either, left, right } from 'src/core/Either';
import { IAtendentRepository } from '../database/atendent.repository.interface';
import { AtendentNotFound } from '../errors/AtendentNotFound';
import { AtendentEntity } from '../atendent.entity';

type GetAtendentByIdUseCasesResponse = Either<AtendentNotFound, AtendentEntity>;

export class GetAtendentByIdUseCases {
  constructor(private atendentRepository: IAtendentRepository) {}

  async execute(id: string): Promise<GetAtendentByIdUseCasesResponse> {
    const result = await this.atendentRepository.findById(id);
    if (!result) {
      return left(new AtendentNotFound());
    }
    return right(result);
  }
}
