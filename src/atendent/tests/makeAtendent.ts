import { AtendentEntity, AtendentProps, Schedule } from '../atendent.entity';
import { makeUser } from 'src/user/tests/makeUser';

const defaultSchedule: Schedule = {
  sunday: [],
  monday: [{ start: '09:00', end: '18:00' }],
  tuesday: [{ start: '09:00', end: '18:00' }],
  wednesday: [{ start: '09:00', end: '18:00' }],
  thursday: [{ start: '09:00', end: '18:00' }],
  friday: [{ start: '09:00', end: '18:00' }],
  saturday: [{ start: '09:00', end: '13:00' }],
};

export function makeAtendent(override?: Partial<AtendentProps>, id?: string) {
  const user = override?.user || makeUser({ isAtendent: true }, 'USER_ID');

  const data: AtendentProps = {
    user,
    name: 'João Silva',
    bio: 'Consultor de tarot experiente',
    rating: 4.5,
    schedule: defaultSchedule,
    ...override,
  };

  return AtendentEntity.create(data, id || 'ATENDENT_ID');
}
