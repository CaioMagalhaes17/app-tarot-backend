import { UpdateAtendentUseCase } from '../use-cases/update-atendent';
import { InMemoryAtendentRepository } from './in-memory-atendent.repository';
import { makeAtendent } from './makeAtendent';
import { makeUser } from 'src/user/tests/makeUser';
import { Schedule } from '../atendent.entity';

let inMemoryAtendentRepository: InMemoryAtendentRepository;
let sut: UpdateAtendentUseCase;

describe('UpdateAtendent', () => {
  beforeEach(() => {
    inMemoryAtendentRepository = new InMemoryAtendentRepository();
    sut = new UpdateAtendentUseCase(inMemoryAtendentRepository);
  });

  it('Should not update when atendent is not found', async () => {
    await sut.execute('NON_EXISTENT_USER_ID', { bio: 'New bio' });

    const atendents = await inMemoryAtendentRepository.findAll();
    expect(atendents).toHaveLength(0);
  });

  it('Should update atendent bio', async () => {
    const user = makeUser({ isAtendent: true }, 'USER_ID');
    const atendent = makeAtendent({ user }, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    await sut.execute('USER_ID', { bio: 'Updated bio' });

    const updatedAtendent = await inMemoryAtendentRepository.findByUserId(
      'USER_ID',
    );
    expect(updatedAtendent?.bio).toBe('Updated bio');
  });

  it('Should update atendent name', async () => {
    const user = makeUser({ isAtendent: true }, 'USER_ID');
    const atendent = makeAtendent({ user }, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    await sut.execute('USER_ID', { name: 'Updated Name' });

    const updatedAtendent = await inMemoryAtendentRepository.findByUserId(
      'USER_ID',
    );
    expect(updatedAtendent?.name).toBe('Updated Name');
  });

  it('Should update atendent schedule', async () => {
    const user = makeUser({ isAtendent: true }, 'USER_ID');
    const atendent = makeAtendent({ user }, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const newSchedule: Schedule = {
      sunday: [],
      monday: [{ start: '10:00', end: '12:00' }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    };

    await sut.execute('USER_ID', { schedule: newSchedule });

    const updatedAtendent = await inMemoryAtendentRepository.findByUserId(
      'USER_ID',
    );
    expect(updatedAtendent?.schedule.monday).toEqual([
      { start: '10:00', end: '12:00' },
    ]);
  });

  it('Should update multiple fields at once', async () => {
    const user = makeUser({ isAtendent: true }, 'USER_ID');
    const atendent = makeAtendent({ user }, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const newSchedule: Schedule = {
      sunday: [],
      monday: [{ start: '14:00', end: '18:00' }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    };

    await sut.execute('USER_ID', {
      name: 'New Name',
      bio: 'New Bio',
      schedule: newSchedule,
    });

    const updatedAtendent = await inMemoryAtendentRepository.findByUserId(
      'USER_ID',
    );
    expect(updatedAtendent?.name).toBe('New Name');
    expect(updatedAtendent?.bio).toBe('New Bio');
    expect(updatedAtendent?.schedule.monday).toEqual([
      { start: '14:00', end: '18:00' },
    ]);
  });

  it('Should not update rating when not provided', async () => {
    const user = makeUser({ isAtendent: true }, 'USER_ID');
    const atendent = makeAtendent({ user, rating: 4.5 }, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    await sut.execute('USER_ID', { bio: 'Updated bio' });

    const updatedAtendent = await inMemoryAtendentRepository.findByUserId(
      'USER_ID',
    );
    expect(updatedAtendent?.rating).toBe(4.5);
  });
});

