import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class EmailGateway {
  constructor(private readonly emailService: EmailService) {}

  async sendEmail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<void> {
    await this.emailService.sendEmail({ to, subject, text, html });
  }
}
