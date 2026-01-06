import { PaginationType } from 'src/infra/pagination.type';
import { IAtendentRepository } from '../database/atendent.repository.interface';

type AtendentsListParams = {
  search?: string;
  service?: string;
};
export class GetAtendentsUseCases {
  constructor(private atendentRepository: IAtendentRepository) {}

  async execute(params: AtendentsListParams, paginationObj?: PaginationType) {
    const result = await this.atendentRepository.findAtendents(
      paginationObj.page,
      paginationObj.limit,
      params.search,
      params.service,
    );
    return result;
  }
}
