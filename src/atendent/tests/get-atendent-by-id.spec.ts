import { GetAtendentByIdUseCases } from '../use-cases/get-atendent-by-id';
import { InMemoryAtendentRepository } from './in-memory-atendent.repository';
import { makeAtendent } from './makeAtendent';
import { AtendentNotFound } from '../errors/AtendentNotFound';

let inMemoryAtendentRepository: InMemoryAtendentRepository;
let sut: GetAtendentByIdUseCases;

describe('GetAtendentById', () => {
  beforeEach(() => {
    inMemoryAtendentRepository = new InMemoryAtendentRepository();
    sut = new GetAtendentByIdUseCases(inMemoryAtendentRepository);
  });

  it('Should return error when atendent is not found', async () => {
    const response = await sut.execute('NON_EXISTENT_ID');

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(AtendentNotFound);
  });

  it('Should return atendent when found', async () => {
    const atendent = makeAtendent({ name: 'João Silva' }, 'ATENDENT_ID');
    inMemoryAtendentRepository.create(atendent);

    const response = await sut.execute('ATENDENT_ID');

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      expect(response.value.id.toString()).toBe('ATENDENT_ID');
      expect(response.value.name).toBe('João Silva');
      expect(response.value.bio).toBe('Consultor de tarot experiente');
    }
  });

  it('Should return correct atendent data', async () => {
    const atendent = makeAtendent(
      {
        name: 'Maria Santos',
        bio: 'Especialista em tarot do amor',
        rating: 4.8,
      },
      'ATENDENT_ID_2',
    );
    inMemoryAtendentRepository.create(atendent);

    const response = await sut.execute('ATENDENT_ID_2');

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      expect(response.value.name).toBe('Maria Santos');
      expect(response.value.bio).toBe('Especialista em tarot do amor');
      expect(response.value.rating).toBe(4.8);
    }
  });
});

