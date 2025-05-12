import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailGateway } from 'src/email/email.gateway';

export class SendEmailVerificationUseCase {
  constructor(
    private readonly emailGateway: EmailGateway,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(name: string, email: string) {
    const token = this.jwtService.sign({ name, email }, { expiresIn: '75h' });
    const magicLink =
      this.configService.get<string>('ENV') === 'local'
        ? `${this.configService.get<string>('FRONTEND_URL_LOCAL')}/auth/magic-link/${token}`
        : `${this.configService.get<string>('FRONTEND_URL_HML')}/auth/magic-link/${token}`;
    console.log(magicLink);
    await this.emailGateway.sendEmail({
      subject: 'Confirme seu email',
      html: `
        <h1>Tarologia Online</h1>
        <p>Olá,</p>
        <p>Clique no link abaixo para acessar sua conta:</p>
        <a href="${magicLink}">${magicLink}</a>
      `,
      to: email,
    });
  }
}
