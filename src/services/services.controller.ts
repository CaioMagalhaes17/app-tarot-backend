import { Controller, Get, Param } from '@nestjs/common';
import { GetAllServicesUseCase } from './use-cases/get-all-services';
import { GetServiceByIdUseCase } from './use-cases/get-service-by-id';
import { ServicesPresenter } from './services.presenter';

@Controller()
export class ServicesController {
  constructor(
    private getAllServicesUseCase: GetAllServicesUseCase,
    private getServiceByIdUseCase: GetServiceByIdUseCase,
  ) {}

  @Get('/services')
  async getUser() {
    const response = await this.getAllServicesUseCase.execute();

    return ServicesPresenter.toHttpArray(response);
  }

  @Get('/services/:serviceId')
  async getUserById(@Param('serviceId') serviceId: string) {
    const response = await this.getServiceByIdUseCase.execute(serviceId);

    return ServicesPresenter.toHttp(response);
  }
}
