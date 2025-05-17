import { PaginationType } from 'src/infra/pagination.type';
import { IAtendentRepository } from '../database/atendent.repository.interface';

export class GetAtendentsUseCases {
  constructor(private atendentRepository: IAtendentRepository) {}

  async execute(paginationObj?: PaginationType) {
    const result = await this.atendentRepository.findAllPaginated(
      paginationObj.page,
      paginationObj.limit,
    );
    return result;
  }
}
