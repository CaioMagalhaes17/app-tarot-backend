import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      throw new WsException('Token não fornecido');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      client.user = payload;
      return true;
    } catch (error) {
      throw new WsException('Token inválido');
    }
  }

  private extractTokenFromHeader(client: any): string | null {
    const authHeader = client.handshake?.headers?.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}

