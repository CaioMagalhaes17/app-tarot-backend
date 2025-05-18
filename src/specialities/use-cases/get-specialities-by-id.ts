import { ISpecialitiesRepository } from '../database/specialities.repository.interface';

export class GetSpecialityByIdUseCase {
  constructor(
    private readonly specialitiesRepository: ISpecialitiesRepository,
  ) {}

  async execute(id: string) {
    return await this.specialitiesRepository.findById(id);
  }
}
