import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare, genSalt, hash } from 'bcryptjs';
import { EncrypterGateway } from './encrypter.interface';

@Injectable()
export class InfraCryptographyGateway implements EncrypterGateway {
  constructor(private jwtService: JwtService) {}

  encryptToken(payload): string {
    return this.jwtService.sign(payload);
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    const passwordhash = await hash(password, salt);
    return passwordhash;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
