import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailGateway } from './email.gateway';

@Module({
  providers: [EmailService, EmailGateway],
  exports: [EmailGateway],
})
export class EmailModule {}
