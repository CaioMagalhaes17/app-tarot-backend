export interface BaseMapper<InfraModel, DomainModel> {
  toDomain(row: InfraModel): DomainModel
  toDomainArray(rows: InfraModel[]): DomainModel[]
}
