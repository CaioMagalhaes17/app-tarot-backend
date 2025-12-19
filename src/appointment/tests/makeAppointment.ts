import { AppointmentEntity, AppointmentProps } from '../appointment.entity';
import { makeUser } from 'src/user/tests/makeUser';
import { makeAtendent } from 'src/atendent/tests/makeAtendent';
import { AtendentServicesEntity } from 'src/atendent-services/atendent-services.entity';
import { ServicesEntity } from 'src/services/services.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';

function makeService(id?: string): ServicesEntity {
  return ServicesEntity.create(
    {
      name: 'Consulta de Tarot',
      description: 'Consulta completa de tarot',
      serviceImg: 'https://example.com/tarot.jpg',
    },
    id || 'SERVICE_ID',
  );
}

function makeAtendentService(
  atendentId: string,
  serviceId?: string,
): AtendentServicesEntity {
  const atendent = makeAtendent({}, atendentId);
  const service = makeService(serviceId);

  return AtendentServicesEntity.create({
    description: 'Consulta de tarot personalizada',
    price: 50,
    service,
    atendent,
    isActive: true,
  });
}

export function makeAppointment(
  override?: Partial<AppointmentProps>,
  id?: string,
) {
  const atendentId = 'ATENDENT_ID';
  const atendentService = makeAtendentService(atendentId);
  const user = makeUser({}, 'USER_ID');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const data: AppointmentProps = {
    atendentService,
    user,
    date: tomorrow,
    startTime: '10:00',
    endTime: '10:30',
    status: 'scheduled',
    createdAt: new Date(),
    ...override,
  };

  return AppointmentEntity.create(data, id || 'APPOINTMENT_ID');
}

