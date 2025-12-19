import { GetAtendentsUseCases } from '../use-cases/get-atendents';
import { InMemoryAtendentRepository } from './in-memory-atendent.repository';
import { makeAtendent } from './makeAtendent';

let inMemoryAtendentRepository: InMemoryAtendentRepository;
let sut: GetAtendentsUseCases;

describe('GetAtendents', () => {
  beforeEach(() => {
    inMemoryAtendentRepository = new InMemoryAtendentRepository();
    sut = new GetAtendentsUseCases(inMemoryAtendentRepository);
  });

  it('Should return empty list when there are no atendents', async () => {
    const result = await sut.execute({}, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.pages).toBe(0);
  });

  it('Should return paginated atendents', async () => {
    inMemoryAtendentRepository.create(makeAtendent({ name: 'João Silva' }));
    inMemoryAtendentRepository.create(makeAtendent({ name: 'Maria Santos' }));
    inMemoryAtendentRepository.create(makeAtendent({ name: 'Pedro Costa' }));

    const result = await sut.execute({}, { page: 1, limit: 2 });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(3);
    expect(result.page).toBe(1);
    expect(result.pages).toBe(2);
  });

  it('Should return second page of atendents', async () => {
    inMemoryAtendentRepository.create(makeAtendent({ name: 'João Silva' }));
    inMemoryAtendentRepository.create(makeAtendent({ name: 'Maria Santos' }));
    inMemoryAtendentRepository.create(makeAtendent({ name: 'Pedro Costa' }));

    const result = await sut.execute({}, { page: 2, limit: 2 });

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(3);
    expect(result.page).toBe(2);
    expect(result.pages).toBe(2);
  });

  it('Should filter atendents by search term', async () => {
    inMemoryAtendentRepository.create(makeAtendent({ name: 'João Silva' }));
    inMemoryAtendentRepository.create(makeAtendent({ name: 'Maria Santos' }));
    inMemoryAtendentRepository.create(makeAtendent({ name: 'Pedro Costa' }));

    const result = await sut.execute({ search: 'João' }, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('João Silva');
    expect(result.total).toBe(1);
  });

  it('Should return empty list when search does not match', async () => {
    inMemoryAtendentRepository.create(makeAtendent({ name: 'João Silva' }));
    inMemoryAtendentRepository.create(makeAtendent({ name: 'Maria Santos' }));

    const result = await sut.execute({ search: 'Pedro' }, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('Should be case insensitive when searching', async () => {
    inMemoryAtendentRepository.create(makeAtendent({ name: 'João Silva' }));
    inMemoryAtendentRepository.create(makeAtendent({ name: 'Maria Santos' }));

    const result = await sut.execute({ search: 'joão' }, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('João Silva');
  });
});

