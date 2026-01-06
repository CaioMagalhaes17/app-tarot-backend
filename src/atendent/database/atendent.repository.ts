import { BaseInfraRepository } from 'src/core/base.repository';
import { Model, Types } from 'mongoose';
import { Atendent } from './atendent.schema';
import { AtendentEntity } from '../atendent.entity';
import { AtendentMapper } from './atendent.mapper';

export class AtendentRepository extends BaseInfraRepository<
  Atendent,
  AtendentEntity
> {
  constructor(
    protected readonly model: Model<Atendent>,
    protected readonly mapper: AtendentMapper,
  ) {
    super(model, mapper);
  }

  async findAll(): Promise<AtendentEntity[]> {
    return this.mapper.toDomainArray(await this.model.find().exec());
  }

  async findByUserId(userId: string) {
    const atendent = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .populate('userId')
      .exec();

    if (atendent.length === 0) return null;
    return this.mapper.toDomain(atendent[0]);
  }

  async findById(id: string) {
    const atendent = this.mapper.toDomain(
      await this.model
        .findById(new Types.ObjectId(id))
        .populate('userId')
        .exec(),
    );

    return atendent;
  }
  async findAtendents(
    page: number,
    limit: number,
    search?: string,
    service?: string,
  ): Promise<{
    data: AtendentEntity[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    // Se houver filtro por serviço, buscar os IDs dos atendentes que oferecem esse serviço
    let atendentIds: Types.ObjectId[] | null = null;
    if (service) {
      // Buscar os IDs dos serviços pelo nome
      const servicesCollection = this.model.db.collection('services');
      const services = await servicesCollection
        .find({ name: { $regex: service, $options: 'i' } })
        .project({ _id: 1 })
        .toArray();

      if (services.length === 0) {
        // Se não encontrou nenhum serviço, retornar vazio
        return {
          data: [],
          total: 0,
          page,
          pages: 0,
        };
      }

      const serviceIds = services.map((s) => s._id);

      // Buscar os IDs dos atendentes que têm esses serviços ativos
      const atendentServicesCollection = this.model.db.collection(
        'atendentservices',
      );
      const atendentServices = await atendentServicesCollection
        .find({
          serviceId: { $in: serviceIds },
          isActive: true,
        })
        .project({ atendentId: 1 })
        .toArray();

      atendentIds = atendentServices.map((as) => as.atendentId);
      
      if (atendentIds.length === 0) {
        // Se não encontrou nenhum atendente com esse serviço, retornar vazio
        return {
          data: [],
          total: 0,
          page,
          pages: 0,
        };
      }
    }

    // Construir query de filtro
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (atendentIds) {
      query._id = { $in: atendentIds };
    }

    const [data, total] = await Promise.all([
      this.model
        .find(Object.keys(query).length > 0 ? query : {})
        .skip(skip)
        .limit(limit)
        .populate('userId')
        .exec(),
      this.model.countDocuments(Object.keys(query).length > 0 ? query : {}).exec(),
    ]);

    return {
      data: this.mapper.toDomainArray(data),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
