import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessAppointmentPaymentUseCase } from '../use-cases/process-appointment-payment';
import { CreateAppointmentAfterPaymentUseCase } from '../use-cases/create-appointment-after-payment';
import { InMemoryPaymentOrderRepository } from 'src/payment/tests/in-memory-payment.repository';
import { InMemoryAppointmentRepository } from './in-memory-appointment.repository';
import { InMemoryAtendentServicesRepository } from 'src/atendent-services/tests/in-memory-atendent-services.repository';
import { InMemoryUserRepository } from 'src/user/tests/in-memory-user.repository';
import { InMemoryAtendentRepository } from 'src/atendent/tests/in-memory-atendent.repository';
import { makePaymentOrder } from 'src/payment/tests/makePaymentOrder';
import { makeAppointment } from './makeAppointment';
import { makeAtendent } from 'src/atendent/tests/makeAtendent';
import { makeUser } from 'src/user/tests/makeUser';
import { AtendentServicesEntity } from 'src/atendent-services/atendent-services.entity';
import { ServicesEntity } from 'src/services/services.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found';

function makeAtendentService(
  atendentId: string,
  serviceId?: string,
): AtendentServicesEntity {
  const atendent = makeAtendent({}, atendentId);
  const service = ServicesEntity.create(
    {
      name: 'Consulta de Tarot',
      description: 'Consulta completa de tarot',
      serviceImg: 'https://example.com/tarot.jpg',
    },
    serviceId || 'SERVICE_ID',
  );

  return AtendentServicesEntity.create({
    description: 'Consulta de tarot personalizada',
    price: 50,
    service,
    atendent,
    isActive: true,
  });
}

describe('ProcessAppointmentPaymentUseCase', () => {
  let paymentOrderRepository: InMemoryPaymentOrderRepository;
  let appointmentRepository: InMemoryAppointmentRepository;
  let atendentServiceRepository: InMemoryAtendentServicesRepository;
  let userRepository: InMemoryUserRepository;
  let atendentRepository: InMemoryAtendentRepository;
  let createAppointmentAfterPayment: CreateAppointmentAfterPaymentUseCase;
  let sut: ProcessAppointmentPaymentUseCase;

  beforeEach(() => {
    paymentOrderRepository = new InMemoryPaymentOrderRepository();
    appointmentRepository = new InMemoryAppointmentRepository();
    atendentServiceRepository = new InMemoryAtendentServicesRepository();
    userRepository = new InMemoryUserRepository();
    atendentRepository = new InMemoryAtendentRepository();

    createAppointmentAfterPayment = new CreateAppointmentAfterPaymentUseCase(
      appointmentRepository,
      atendentServiceRepository,
      userRepository,
      atendentRepository,
    );

    sut = new ProcessAppointmentPaymentUseCase(
      paymentOrderRepository,
      appointmentRepository,
      createAppointmentAfterPayment,
    );
  });

  it('Should process payment and create appointment', async () => {
    const atendentId = 'ATENDENT_ID';
    const userId = 'USER_ID';
    const serviceId = 'SERVICE_ID';
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const user = makeUser({}, userId);
    const atendent = makeAtendent({}, atendentId);
    const atendentService = makeAtendentService(atendentId, serviceId);

    await userRepository.create(user);
    await atendentRepository.create(atendent);
    await atendentServiceRepository.create(atendentService);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Cria payment order com metadados no description (formato JSON)
    const paymentOrder = makePaymentOrder(
      {
        status: 'completed',
        productType: 'appointment',
        userId,
        description: JSON.stringify({
          atendentServiceId: serviceId,
          userId,
          date: tomorrow.toISOString(),
          startTime: '10:00',
          endTime: '10:30',
        }),
      },
      paymentOrderId,
    );
    await paymentOrderRepository.create(paymentOrder);

    const result = await sut.execute(paymentOrderId);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.appointmentId).toBeDefined();

      const createdAppointment = await appointmentRepository.findById(
        result.value.appointmentId,
      );
      expect(createdAppointment).toBeTruthy();
      expect(createdAppointment?.paymentOrderId).toBe(paymentOrderId);
    }
  });

  it('Should return existing appointment if already created (idempotency)', async () => {
    const atendentId = 'ATENDENT_ID';
    const userId = 'USER_ID';
    const serviceId = 'SERVICE_ID';
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const user = makeUser({}, userId);
    const atendent = makeAtendent({}, atendentId);
    const atendentService = makeAtendentService(atendentId, serviceId);

    await userRepository.create(user);
    await atendentRepository.create(atendent);
    await atendentServiceRepository.create(atendentService);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Cria payment order
    const paymentOrder = makePaymentOrder(
      {
        status: 'completed',
        productType: 'appointment',
        userId,
        description: JSON.stringify({
          atendentServiceId: serviceId,
          userId,
          date: tomorrow.toISOString(),
          startTime: '10:00',
          endTime: '10:30',
        }),
      },
      paymentOrderId,
    );
    await paymentOrderRepository.create(paymentOrder);

    // Cria appointment existente vinculado ao payment order
    const existingAppointment = makeAppointment(
      {
        date: tomorrow,
        startTime: '10:00',
        endTime: '10:30',
        paymentOrderId,
      },
      'EXISTING_APPOINTMENT_ID',
    );
    await appointmentRepository.create(existingAppointment);

    const result = await sut.execute(paymentOrderId);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      // Deve retornar o appointment existente
      expect(result.value.appointmentId).toBe('EXISTING_APPOINTMENT_ID');
    }

    // Verifica que não foi criado um novo appointment
    const appointments = await appointmentRepository.findAll();
    const appointmentsWithPaymentOrder = appointments.filter(
      (apt) => apt.paymentOrderId === paymentOrderId,
    );
    expect(appointmentsWithPaymentOrder.length).toBe(1);
  });

  it('Should not create appointment if payment order does not exist', async () => {
    const result = await sut.execute('NON_EXISTENT_PAYMENT_ORDER');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
      expect(result.value.message).toBe('Pagamento não encontrado');
    }
  });

  it('Should not create appointment if payment is not completed', async () => {
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const paymentOrder = makePaymentOrder(
      {
        status: 'pending', // Não está completed
        productType: 'appointment',
      },
      paymentOrderId,
    );
    await paymentOrderRepository.create(paymentOrder);

    const result = await sut.execute(paymentOrderId);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Pagamento não está confirmado para criar agendamento',
      );
    }
  });

  it('Should not create appointment if product type is not appointment', async () => {
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    // Testa se o metadata está faltando
    const paymentOrderWithoutMetadata = makePaymentOrder(
      {
        status: 'completed',
        productType: 'appointment',
        description: 'Sem metadados',
      },
      paymentOrderId,
    );
    await paymentOrderRepository.create(paymentOrderWithoutMetadata);

    const result = await sut.execute(paymentOrderId);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Metadados do agendamento não encontrados no pagamento',
      );
    }
  });

  it('Should not create appointment if metadata is missing', async () => {
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const paymentOrder = makePaymentOrder(
      {
        status: 'completed',
        productType: 'appointment',
        description: 'Descrição sem metadados JSON',
      },
      paymentOrderId,
    );
    await paymentOrderRepository.create(paymentOrder);

    const result = await sut.execute(paymentOrderId);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Metadados do agendamento não encontrados no pagamento',
      );
    }
  });

  it('Should not create appointment if metadata is invalid JSON', async () => {
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const paymentOrder = makePaymentOrder(
      {
        status: 'completed',
        productType: 'appointment',
        description: 'Invalid JSON {',
      },
      paymentOrderId,
    );
    await paymentOrderRepository.create(paymentOrder);

    const result = await sut.execute(paymentOrderId);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Metadados do agendamento não encontrados no pagamento',
      );
    }
  });

  it('Should not create appointment if metadata is missing required fields', async () => {
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const paymentOrder = makePaymentOrder(
      {
        status: 'completed',
        productType: 'appointment',
        description: JSON.stringify({
          // Faltando campos obrigatórios
          atendentServiceId: 'SERVICE_ID',
          // userId faltando
          // date faltando
        }),
      },
      paymentOrderId,
    );
    await paymentOrderRepository.create(paymentOrder);

    const result = await sut.execute(paymentOrderId);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Metadados do agendamento não encontrados no pagamento',
      );
    }
  });
});

