export interface BaseDomainRepository<DomainModel> {
  create(data: Partial<DomainModel>): Promise<{ id: string }>;
  findAll(): Promise<DomainModel[]>;
  findById(id: string): Promise<DomainModel | null>;
  updateById(id: string, updateData: DomainModel): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteAll(): Promise<void>;
  findByParam<ParamType>(
    param: Partial<ParamType>,
    paginateObj?: { page: number; limit: number },
  ): Promise<DomainModel[]>;
  search(field: string, query: string): Promise<DomainModel[]>;
  findAllPaginated<T>(page: number, limit: number, param?: T);
}
