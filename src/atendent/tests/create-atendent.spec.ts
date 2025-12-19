import { CreateAtendentUseCase } from '../use-cases/create-atendent';
import { InMemoryAtendentRepository } from './in-memory-atendent.repository';
import { InMemoryUserRepository } from 'src/user/tests/in-memory-user.repository';
import { makeUser } from 'src/user/tests/makeUser';
import { makeAtendent } from './makeAtendent';
import { Schedule } from '../atendent.entity';

let inMemoryAtendentRepository: InMemoryAtendentRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let sut: CreateAtendentUseCase;

describe('CreateAtendent', () => {
  beforeEach(() => {
    inMemoryAtendentRepository = new InMemoryAtendentRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new CreateAtendentUseCase(
      inMemoryAtendentRepository,
      inMemoryUserRepository,
    );
  });

  it('Should create atendent successfully', async () => {
    const user = makeUser({ isAtendent: true }, 'USER_ID');
    inMemoryUserRepository.create(user);

    const schedule: Schedule = {
      sunday: [],
      monday: [{ start: '09:00', end: '18:00' }],
      tuesday: [{ start: '09:00', end: '18:00' }],
      wednesday: [{ start: '09:00', end: '18:00' }],
      thursday: [{ start: '09:00', end: '18:00' }],
      friday: [{ start: '09:00', end: '18:00' }],
      saturday: [{ start: '09:00', end: '13:00' }],
    };

    await sut.execute({
      userId: 'USER_ID',
      name: 'João Silva',
      bio: 'Consultor de tarot experiente',
      schedule,
    });

    const atendents = await inMemoryAtendentRepository.findAll();
    expect(atendents).toHaveLength(1);
    expect(atendents[0].name).toBe('João Silva');
    expect(atendents[0].bio).toBe('Consultor de tarot experiente');
    expect(atendents[0].rating).toBe(0);
    expect(atendents[0].user.id.toString()).toBe('USER_ID');
  });

  it('Should create atendent with correct schedule', async () => {
    const user = makeUser({ isAtendent: true }, 'USER_ID');
    inMemoryUserRepository.create(user);

    const schedule: Schedule = {
      sunday: [],
      monday: [{ start: '10:00', end: '12:00' }],
      tuesday: [],
      wednesday: [{ start: '14:00', end: '16:00' }],
      thursday: [],
      friday: [],
      saturday: [],
    };

    await sut.execute({
      userId: 'USER_ID',
      name: 'Maria Santos',
      bio: 'Especialista em tarot',
      schedule,
    });

    const atendents = await inMemoryAtendentRepository.findAll();
    expect(atendents).toHaveLength(1);
    expect(atendents[0].schedule.monday).toEqual([{ start: '10:00', end: '12:00' }]);
    expect(atendents[0].schedule.wednesday).toEqual([
      { start: '14:00', end: '16:00' },
    ]);
  });

  it('Should create multiple atendents', async () => {
    const user1 = makeUser({ isAtendent: true }, 'USER_ID_1');
    const user2 = makeUser({ isAtendent: true }, 'USER_ID_2');
    inMemoryUserRepository.create(user1);
    inMemoryUserRepository.create(user2);

    const schedule: Schedule = {
      sunday: [],
      monday: [{ start: '09:00', end: '18:00' }],
      tuesday: [{ start: '09:00', end: '18:00' }],
      wednesday: [{ start: '09:00', end: '18:00' }],
      thursday: [{ start: '09:00', end: '18:00' }],
      friday: [{ start: '09:00', end: '18:00' }],
      saturday: [{ start: '09:00', end: '13:00' }],
    };

    await sut.execute({
      userId: 'USER_ID_1',
      name: 'João Silva',
      bio: 'Consultor de tarot',
      schedule,
    });

    await sut.execute({
      userId: 'USER_ID_2',
      name: 'Maria Santos',
      bio: 'Especialista em tarot',
      schedule,
    });

    const atendents = await inMemoryAtendentRepository.findAll();
    expect(atendents).toHaveLength(2);
  });
});

