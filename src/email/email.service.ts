import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: '80fb27002@smtp-brevo.com', // Seu e-mail do Hotmail
      pass: 'wQUvHEbzaITx3072', // Sua senha ou senha de aplicativo
    },
  });

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
    try {
      const info = await this.transporter.sendMail({
        from: 'caiomagalhaesdefaira@gmail.com',
        to,
        subject,
        text,
        html,
      });
      console.log(info);
      this.logger.log(`Email enviado: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Erro ao enviar email', error);
      throw error;
    }
  }
}
