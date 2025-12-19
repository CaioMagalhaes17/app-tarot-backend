import { Either, left, right } from 'src/core/Either';
import { IPaymentOrderRepository } from 'src/payment/database/payment-order.repository.interface';
import { IAppointmentRepository } from '../database/appointment.repository.interface';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found';
import { CreateAppointmentAfterPaymentUseCase } from './create-appointment-after-payment';
import { PaymentOrderEntity } from 'src/payment/payment-order.entity';

type AppointmentMetadata = {
  atendentServiceId: string;
  userId: string;
  date: string; // ISO string
  startTime: string;
  endTime: string;
};

export class ProcessAppointmentPaymentUseCase {
  constructor(
    private paymentOrderRepository: IPaymentOrderRepository,
    private appointmentRepository: IAppointmentRepository,
    private createAppointmentAfterPayment: CreateAppointmentAfterPaymentUseCase,
  ) {}

  async execute(
    paymentOrderId: string,
  ): Promise<
    Either<ResourceNotFoundError | Error, { appointmentId: string }>
  > {
    // 1. Buscar PaymentOrder
    const paymentOrder = await this.paymentOrderRepository.findById(
      paymentOrderId,
    );
    if (!paymentOrder) {
      return left(new ResourceNotFoundError('Pagamento não encontrado'));
    }

    // 2. Verificar se já existe agendamento para este pagamento (idempotência)
    const existingAppointment =
      await this.appointmentRepository.findByPaymentOrderId(paymentOrderId);
    if (existingAppointment) {
      // Idempotência: já foi criado
      return right({ appointmentId: existingAppointment.id.toString() });
    }

    // 3. Verificar se pagamento está completed
    if (paymentOrder.status !== 'completed') {
      return left(
        new Error('Pagamento não está confirmado para criar agendamento'),
      );
    }

    // 4. Verificar se productType é appointment
    if (paymentOrder.productType !== 'appointment') {
      return left(
        new Error('Tipo de produto não é um agendamento'),
      );
    }

    // 5. Extrair metadados do pagamento
    // Por enquanto, vamos assumir que os metadados estão no description
    // No futuro, podemos adicionar um campo metadata no PaymentOrderEntity
    const metadata = this.extractMetadataFromPaymentOrder(paymentOrder);
    if (!metadata) {
      return left(
        new Error('Metadados do agendamento não encontrados no pagamento'),
      );
    }

    // 6. Criar agendamento usando o use case específico
    const result = await this.createAppointmentAfterPayment.execute({
      paymentOrderId,
      atendentServiceId: metadata.atendentServiceId,
      userId: metadata.userId,
      date: new Date(metadata.date),
      startTime: metadata.startTime,
      endTime: metadata.endTime,
    });

    if (result.isLeft()) {
      return left(result.value);
    }

    return right({ appointmentId: result.value.appointmentId });
  }

  /**
   * Extrai metadados do agendamento do PaymentOrder
   * Por enquanto, vamos usar uma estrutura simples no description
   * Formato esperado: JSON string com os metadados
   * No futuro, isso deve ser substituído por um campo metadata no PaymentOrderEntity
   */
  private extractMetadataFromPaymentOrder(
    paymentOrder: PaymentOrderEntity,
  ): AppointmentMetadata | null {
    // Por enquanto, vamos usar o description como JSON
    // No futuro, devemos adicionar um campo metadata no PaymentOrderEntity
    try {
      // Se description for um JSON string, parse
      if (paymentOrder.description) {
        const parsed = JSON.parse(paymentOrder.description);
        if (
          parsed.atendentServiceId &&
          parsed.userId &&
          parsed.date &&
          parsed.startTime &&
          parsed.endTime
        ) {
          return {
            atendentServiceId: parsed.atendentServiceId,
            userId: parsed.userId,
            date: parsed.date,
            startTime: parsed.startTime,
            endTime: parsed.endTime,
          };
        }
      }
    } catch (error) {
      // Se não for JSON, retorna null
    }

    // Se não conseguir extrair, retorna null
    // No futuro, isso deve ser substituído por um campo metadata no PaymentOrderEntity
    return null;
  }
}

