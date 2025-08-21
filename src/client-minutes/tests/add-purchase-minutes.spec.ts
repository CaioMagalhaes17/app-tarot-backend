import { InMemoryUserRepository } from 'src/user/tests/in-memory-user.repository';
import { InMemoryClientMinutesRepository } from './in-memory-client-minutes.repository';
import { AddPurchaseMinutesUseCase } from '../use-cases/add-purchase-minutes';
import { UserNotFound } from 'src/user/errors/UserNotFound';
import { UserEntity } from 'src/user/user.entity';
import { ClientMinutesEntity } from '../client-minutes.entity';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryClientMinutesRepository: InMemoryClientMinutesRepository;
let sut: AddPurchaseMinutesUseCase;

describe('AddPurchaseMinutes', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryClientMinutesRepository = new InMemoryClientMinutesRepository();
    sut = new AddPurchaseMinutesUseCase(
      inMemoryClientMinutesRepository,
      inMemoryUserRepository,
    );
  });

  it('não deve adicionar em um usuário não existente', async () => {
    const response = await sut.execute('TESTE', 30);
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFound);
  });

  it('Deve adicionar os minutos caso seja a primeira transação', async () => {
    inMemoryUserRepository.create(
      UserEntity.create(
        {
          isAtendent: false,
          isVerified: true,
          login: 'teste',
          name: 'teste',
          password: '123',
          permission: 'normal',
          profileImg: 'teste',
        },
        'ID_TESTE',
      ),
    );
    const response = await sut.execute('ID_TESTE', 30);
    console.log(inMemoryClientMinutesRepository.clientMinutes);
    expect(response.isRight()).toBe(true);
    expect(inMemoryClientMinutesRepository.clientMinutes[0].totalMinutes).toBe(
      30,
    );
  });

  it('Deve adicionar os minutos caso seja não primeira transação', async () => {
    const user = UserEntity.create(
      {
        isAtendent: false,
        isVerified: true,
        login: 'teste',
        name: 'teste',
        password: '123',
        permission: 'normal',
        profileImg: 'teste',
      },
      'ID_TESTE',
    );
    inMemoryUserRepository.create(user);
    inMemoryClientMinutesRepository.create(
      ClientMinutesEntity.create({
        avaliableMinutes: 30,
        totalMinutes: 60,
        transactions: [
          {
            date: new Date(),
            minutes: 30,
            type: 'purchase',
            description: 'Compra efetuada',
          },
          {
            date: new Date(),
            minutes: 30,
            type: 'purchase',
            description: 'Compra efetuada',
          },
        ],
        user,
      }),
    );

    const response = await sut.execute('ID_TESTE', 30);
    expect(response.isRight()).toBe(true);
    expect(
      inMemoryClientMinutesRepository.clientMinutes[0].transactions.length ===
      3,
    ).toBe(true);
    expect(inMemoryClientMinutesRepository.clientMinutes[0].totalMinutes).toBe(
      90,
    );
  });
});
