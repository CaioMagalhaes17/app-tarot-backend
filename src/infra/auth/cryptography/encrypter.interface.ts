export abstract class EncrypterGateway {
  abstract encryptToken(payload): string;
  abstract encryptPassword(password: string): Promise<string>;
  abstract comparePassword(password: string, hash: string): Promise<boolean>;
}
