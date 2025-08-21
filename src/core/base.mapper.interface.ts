export interface BaseMapperInterface<InfraModel, DomainModel> {
  toDomain(row: InfraModel): DomainModel;
  toDomainArray(rows: InfraModel[]): DomainModel[];
  toPersistance(domain: DomainModel): Record<string, any>;
}
