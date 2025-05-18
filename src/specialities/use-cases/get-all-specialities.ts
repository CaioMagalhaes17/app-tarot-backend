import { ISpecialitiesRepository } from '../database/specialities.repository.interface';

export class GetAllSpecialitiesUseCase {
  constructor(
    private readonly specialitiesRepository: ISpecialitiesRepository,
  ) {}

  async execute() {
    return await this.specialitiesRepository.findAll();
  }
}
