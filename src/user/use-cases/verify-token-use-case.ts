import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../database/user.repository.interface';

export class VerifyTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string) {
    const decoded = this.jwtService.verify(token);
    const user = await this.userRepository.findByParam<{ login: string }>({
      login: decoded.email,
    });
    if (user.length === 1) {
      user[0].update({ isVerified: true });
      await this.userRepository.updateById(user[0].id.toString(), user[0]);
    }

    return { name: decoded.name, email: decoded.email }; // Retorna o ID do usuário
  }
}
