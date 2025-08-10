/* eslint-disable prettier/prettier */
import { Model } from "mongoose"
import { BaseMapperInterface } from "./base.mapper.interface"
import { BaseDomainRepository } from "./base.repository.interface"

export abstract class BaseInfraRepository<InfraModel, DomainModel>
  implements BaseDomainRepository<DomainModel> {
  constructor(
    protected readonly model: Model<InfraModel>,
    protected readonly mapper: BaseMapperInterface<InfraModel, DomainModel>,
  ) {}

  async create(data: Partial<DomainModel>): Promise<{ id: string }> {
    return { id: (await this.model.create(data)).id }
  }

  async findAll(): Promise<DomainModel[]> {
    return this.mapper.toDomainArray(await this.model.find().exec())
  }

  async findById(id: string): Promise<DomainModel | null> {
    return this.mapper.toDomain(await this.model.findById(id).exec())
  }

  async search(field: any, query: string): Promise<DomainModel[]> {
    const result = await this.model.find({ [field]: { $regex: query, $options: 'i' } }).exec()
    return this.mapper.toDomainArray(result)
  }

  async updateById(
    id: string,
    updateData: DomainModel,
  ): Promise<DomainModel> {
    await this.model.findByIdAndUpdate(id, updateData)
    return this.mapper.toDomain(await this.model.findById(id).exec())
  }

  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec()
  }

  async deleteAll(): Promise<void> {
    await this.model.deleteMany({})
  }

  async findByParam<ParamType>(param: ParamType, paginateObj?: { page: number, limit: number }) {
    if (paginateObj) {
      const items = await this.findAllPaginated<ParamType>(paginateObj.page, paginateObj.limit, param)
      return items.data
    }
    return this.mapper.toDomainArray(await this.model.find(param).exec())
  }

  async findAllPaginated<T = unknown>(page: number, limit: number, param?: T) {
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.model.find(param).skip(skip).limit(limit).exec(),
      this.model.countDocuments().exec(),
    ])

    return {
      data: this.mapper.toDomainArray(data),
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  }


}
