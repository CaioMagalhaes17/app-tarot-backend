import { EncrypterGateway } from 'src/infra/auth/cryptography/encrypter.interface';
import { IUserRepository } from '../database/user.repository.interface';
import { UserEntity } from '../user.entity';
import { Either, left, right } from 'src/core/Either';
import { LoginAlreadyExists } from '../errors/LoginAlreadyExists';

export interface GoogleUserInfo {
  googleId: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface IGoogleAuthService {
  verifyToken(idToken: string): Promise<GoogleUserInfo>;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export type GoogleLoginResponse = Either<
  LoginAlreadyExists,
  { accessToken: string }
>;

export class GoogleLoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtAuthService: EncrypterGateway,
    private readonly googleAuthService: IGoogleAuthService,
  ) {}

  async execute(request: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    this.validateRequest(request);

    // Verificar o token do Google
    const googleUserInfo = await this.googleAuthService.verifyToken(
      request.idToken,
    );

    // Verificar se já existe um usuário com este googleId
    let user = await this.userRepository.findByGoogleId(
      googleUserInfo.googleId,
    );

    if (!user) {
      // Verificar se já existe um usuário com este email
      const existingUserByEmail = await this.userRepository.fetchUserByLogin(
        googleUserInfo.email,
      );

      if (existingUserByEmail) {
        // Se o usuário já existe mas não tem googleId, atualizar para incluir o googleId
        if (!existingUserByEmail.googleId) {
          await this.userRepository.updateById(
            existingUserByEmail.id.toString(),
            {
              googleId: googleUserInfo.googleId,
            },
          );
          user = existingUserByEmail;
        } else {
          return left(new LoginAlreadyExists());
        }
      } else {
        // Criar novo usuário do Google
        user = UserEntity.createFromGoogle(
          googleUserInfo.googleId,
          googleUserInfo.name,
          googleUserInfo.email,
        );
        const id = await this.userRepository.create(user);

        const payload = {
          id: id.id,
          login: user.login,
          isVerified: user.isVerified,
        };
        const accessToken = this.jwtAuthService.encryptToken(payload);

        return right({ accessToken });
      }
    }
    // Gerar token JWT
    const payload = {
      id: user.id.toString(),
      login: user.login,
      isVerified: user.isVerified,
    };
    const accessToken = this.jwtAuthService.encryptToken(payload);

    return right({ accessToken });
  }

  private validateRequest(request: GoogleLoginRequest): void {
    if (!request.idToken || request.idToken.trim().length === 0) {
      throw new Error('ID token is required');
    }
  }
}
