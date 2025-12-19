import { Either, left, right } from 'src/core/Either';
import { IAtendentServicesRepository } from 'src/atendent-services/database/atendent-services.repository.interface';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found';
import { CreatePaymentOrderUseCase } from 'src/payment/use-cases/create-payment-order';
import { IAppointmentRepository } from '../database/appointment.repository.interface';
import { IAtendentRepository } from 'src/atendent/database/atendent.repository.interface';
import { GetAvailabilityUseCase } from 'src/atendent/use-cases/get-availability';
import { AppointmentEntity } from '../appointment.entity';

type CreateAppointmentPaymentOrderRequest = {
  userId: string;
  atendentServiceId: string;
  date: Date;
  startTime: string;
  endTime: string;
};

export class CreateAppointmentPaymentOrderUseCase {
  constructor(
    private atendentServiceRepository: IAtendentServicesRepository,
    private createPaymentOrderUseCase: CreatePaymentOrderUseCase,
    private appointmentRepository: IAppointmentRepository,
    private atendentRepository: IAtendentRepository,
  ) {}

  async execute(
    request: CreateAppointmentPaymentOrderRequest,
  ): Promise<
    Either<
      ResourceNotFoundError | Error,
      { id: string; externalId: string; checkoutUrl: string }
    >
  > {
    // 1. Validar se atendentService existe e está ativo
    const atendentService =
      await this.atendentServiceRepository.findById(request.atendentServiceId);
    if (!atendentService) {
      return left(new ResourceNotFoundError('Serviço não encontrado'));
    }

    if (!atendentService.isActive) {
      return left(new Error('Serviço não está ativo'));
    }

    // 2. Validar se a data não está no passado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(request.date);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return left(new Error('Não é possível agendar em datas passadas'));
    }

    // 3. Validar disponibilidade do atendente
    const atendentId = atendentService.atendent.id.toString();
    const availabilityResult = await new GetAvailabilityUseCase(
      this.atendentRepository,
      this.appointmentRepository,
    ).execute(atendentId, appointmentDate, appointmentDate);

    if (availabilityResult.isLeft()) {
      return left(availabilityResult.value);
    }

    // Verificar se o horário escolhido está disponível
    const selectedDate = appointmentDate.toISOString().split('T')[0];
    const dayAvailability = availabilityResult.value.days.find(
      (day) => day.date === selectedDate,
    );

    if (!dayAvailability) {
      return left(new Error('Data não disponível para agendamento'));
    }

    const isTimeSlotAvailable = dayAvailability.availableSlots.some(
      (slot) =>
        slot.start === request.startTime && slot.end === request.endTime,
    );

    if (!isTimeSlotAvailable) {
      return left(
        new Error('Horário não disponível. Por favor, escolha outro horário.'),
      );
    }

    // 4. Criar metadados do agendamento para o payment order
    const metadata = {
      atendentServiceId: request.atendentServiceId,
      userId: request.userId,
      date: appointmentDate.toISOString(),
      startTime: request.startTime,
      endTime: request.endTime,
    };

    // 5. Criar payment order com os metadados no description
    const paymentOrderResult = await this.createPaymentOrderUseCase.execute({
      userId: request.userId,
      amount: atendentService.price,
      description: JSON.stringify(metadata),
      productType: 'appointment',
    });

    if (paymentOrderResult.isLeft()) {
      return left(paymentOrderResult.value);
    }

    return right(paymentOrderResult.value);
  }
}

