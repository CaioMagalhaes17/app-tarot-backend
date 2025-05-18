import { Controller, Get, Param } from '@nestjs/common';
import { GetSpecialityByIdUseCase } from './use-cases/get-specialities-by-id';
import { GetAllSpecialitiesUseCase } from './use-cases/get-all-specialities';
import { SpecialitiesPresenter } from './specialities.presenter';

@Controller()
export class SpecialitiesController {
  constructor(
    private getSpecialityByIdUseCase: GetSpecialityByIdUseCase,
    private getAllSpecialitiesUseCase: GetAllSpecialitiesUseCase,
  ) {}

  @Get('/specialities')
  async getUser() {
    const response = await this.getAllSpecialitiesUseCase.execute();
    return response.map((item) => SpecialitiesPresenter.toHttp(item));
  }

  @Get('/specialities/:specialityId')
  async getUserById(@Param('specialityId') specialityId: string) {
    const response = await this.getSpecialityByIdUseCase.execute(specialityId);
    return SpecialitiesPresenter.toHttp(response);
  }
}
