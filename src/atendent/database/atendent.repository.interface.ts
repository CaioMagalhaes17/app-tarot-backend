import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { AtendentEntity } from '../atendent.entity';

export interface IAtendentRepository
  extends BaseDomainRepository<AtendentEntity> {
  findByUserId(userId: string): Promise<AtendentEntity | null>;
  findAtendents(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: AtendentEntity[];
    total: number;
    page: number;
    pages: number;
  }>;
}
