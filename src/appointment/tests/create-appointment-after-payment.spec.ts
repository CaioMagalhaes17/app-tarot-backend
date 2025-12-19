import { describe, it, expect, beforeEach } from 'vitest';
import { CreateAppointmentAfterPaymentUseCase } from '../use-cases/create-appointment-after-payment';
import { InMemoryAppointmentRepository } from './in-memory-appointment.repository';
import { InMemoryAtendentServicesRepository } from 'src/atendent-services/tests/in-memory-atendent-services.repository';
import { InMemoryUserRepository } from 'src/user/tests/in-memory-user.repository';
import { InMemoryAtendentRepository } from 'src/atendent/tests/in-memory-atendent.repository';
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

describe('CreateAppointmentAfterPaymentUseCase', () => {
  let appointmentRepository: InMemoryAppointmentRepository;
  let atendentServiceRepository: InMemoryAtendentServicesRepository;
  let userRepository: InMemoryUserRepository;
  let atendentRepository: InMemoryAtendentRepository;
  let sut: CreateAppointmentAfterPaymentUseCase;

  beforeEach(() => {
    appointmentRepository = new InMemoryAppointmentRepository();
    atendentServiceRepository = new InMemoryAtendentServicesRepository();
    userRepository = new InMemoryUserRepository();
    atendentRepository = new InMemoryAtendentRepository();
    sut = new CreateAppointmentAfterPaymentUseCase(
      appointmentRepository,
      atendentServiceRepository,
      userRepository,
      atendentRepository,
    );
  });

  it('Should create appointment after payment', async () => {
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

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.appointmentId).toBeDefined();

      const createdAppointment = await appointmentRepository.findById(
        result.value.appointmentId,
      );
      expect(createdAppointment).toBeTruthy();
      expect(createdAppointment?.paymentOrderId).toBe(paymentOrderId);
      expect(createdAppointment?.status).toBe('scheduled');
      expect(createdAppointment?.startTime).toBe('10:00');
      expect(createdAppointment?.endTime).toBe('10:30');
    }
  });

  it('Should not create appointment if atendentService does not exist', async () => {
    const userId = 'USER_ID';
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const user = makeUser({}, userId);
    await userRepository.create(user);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: 'NON_EXISTENT_SERVICE',
      userId,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
      expect(result.value.message).toBe('Serviço não encontrado');
    }
  });

  it('Should not create appointment if atendentService is inactive', async () => {
    const atendentId = 'ATENDENT_ID';
    const userId = 'USER_ID';
    const serviceId = 'SERVICE_ID';
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const user = makeUser({}, userId);
    const atendent = makeAtendent({}, atendentId);
    const atendentService = makeAtendentService(atendentId, serviceId);
    atendentService.inactivate();

    await userRepository.create(user);
    await atendentRepository.create(atendent);
    await atendentServiceRepository.create(atendentService);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe('Serviço não está mais ativo');
    }
  });

  it('Should not create appointment if user does not exist', async () => {
    const atendentId = 'ATENDENT_ID';
    const serviceId = 'SERVICE_ID';
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const atendent = makeAtendent({}, atendentId);
    const atendentService = makeAtendentService(atendentId, serviceId);

    await atendentRepository.create(atendent);
    await atendentServiceRepository.create(atendentService);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId: 'NON_EXISTENT_USER',
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
      expect(result.value.message).toBe('Usuário não encontrado');
    }
  });

  it('Should not create appointment if date is in the past', async () => {
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

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId,
      date: yesterday,
      startTime: '10:00',
      endTime: '10:30',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Não é possível agendar em datas passadas',
      );
    }
  });

  it('Should not create appointment if time slot is already occupied', async () => {
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

    // Cria um agendamento existente no mesmo horário
    const existingAppointment = makeAppointment(
      {
        date: tomorrow,
        startTime: '10:00',
        endTime: '10:30',
        status: 'scheduled',
      },
      'EXISTING_APPOINTMENT_ID',
    );
    await appointmentRepository.create(existingAppointment);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Horário não está mais disponível. Foi ocupado por outro agendamento.',
      );
    }
  });

  it('Should not create appointment if time slot overlaps with existing appointment', async () => {
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

    // Cria um agendamento existente que sobrepõe
    const existingAppointment = makeAppointment(
      {
        date: tomorrow,
        startTime: '10:15',
        endTime: '10:45',
        status: 'scheduled',
      },
      'EXISTING_APPOINTMENT_ID',
    );
    await appointmentRepository.create(existingAppointment);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Horário não está mais disponível. Foi ocupado por outro agendamento.',
      );
    }
  });

  it('Should not create appointment if atendent does not work on that weekday', async () => {
    const atendentId = 'ATENDENT_ID';
    const userId = 'USER_ID';
    const serviceId = 'SERVICE_ID';
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const user = makeUser({}, userId);
    const atendent = makeAtendent(
      {
        schedule: {
          sunday: [],
          monday: [{ start: '09:00', end: '18:00' }],
          tuesday: [{ start: '09:00', end: '18:00' }],
          wednesday: [{ start: '09:00', end: '18:00' }],
          thursday: [{ start: '09:00', end: '18:00' }],
          friday: [{ start: '09:00', end: '18:00' }],
          saturday: [], // Não trabalha no sábado
        },
      },
      atendentId,
    );
    const atendentService = makeAtendentService(atendentId, serviceId);

    await userRepository.create(user);
    await atendentRepository.create(atendent);
    await atendentServiceRepository.create(atendentService);

    // Cria uma data que é sábado
    const saturday = new Date();
    const daysUntilSaturday = (6 - saturday.getDay()) % 7;
    saturday.setDate(saturday.getDate() + (daysUntilSaturday || 7));
    saturday.setHours(0, 0, 0, 0);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId,
      date: saturday,
      startTime: '10:00',
      endTime: '10:30',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Atendente não trabalha neste dia da semana',
      );
    }
  });

  it('Should not create appointment if time is outside atendent schedule', async () => {
    const atendentId = 'ATENDENT_ID';
    const userId = 'USER_ID';
    const serviceId = 'SERVICE_ID';
    const paymentOrderId = 'PAYMENT_ORDER_ID';

    const user = makeUser({}, userId);
    const atendent = makeAtendent(
      {
        schedule: {
          sunday: [],
          monday: [{ start: '09:00', end: '12:00' }], // Trabalha apenas até 12:00
          tuesday: [{ start: '09:00', end: '18:00' }],
          wednesday: [{ start: '09:00', end: '18:00' }],
          thursday: [{ start: '09:00', end: '18:00' }],
          friday: [{ start: '09:00', end: '18:00' }],
          saturday: [],
        },
      },
      atendentId,
    );
    const atendentService = makeAtendentService(atendentId, serviceId);

    await userRepository.create(user);
    await atendentRepository.create(atendent);
    await atendentServiceRepository.create(atendentService);

    // Cria uma data que é segunda-feira
    const monday = new Date();
    const daysUntilMonday = (1 - monday.getDay() + 7) % 7;
    monday.setDate(monday.getDate() + (daysUntilMonday || 7));
    monday.setHours(0, 0, 0, 0);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId,
      date: monday,
      startTime: '14:00', // Fora do horário de trabalho
      endTime: '14:30',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Horário escolhido está fora do horário de trabalho do atendente',
      );
    }
  });

  it('Should ignore canceled appointments when checking availability', async () => {
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

    // Cria um agendamento cancelado no mesmo horário
    const canceledAppointment = makeAppointment(
      {
        date: tomorrow,
        startTime: '10:00',
        endTime: '10:30',
        status: 'canceled',
      },
      'CANCELED_APPOINTMENT_ID',
    );
    await appointmentRepository.create(canceledAppointment);

    const result = await sut.execute({
      paymentOrderId,
      atendentServiceId: serviceId,
      userId,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
    });

    // Deve permitir criar porque o agendamento está cancelado
    expect(result.isRight()).toBe(true);
  });
});

