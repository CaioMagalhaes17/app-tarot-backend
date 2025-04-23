import { Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { InfraCryptographyGateway } from './cryptography.gateway';
import { EncrypterGateway } from './encrypter.interface';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: EncrypterGateway,
      useClass: InfraCryptographyGateway,
    },
  ],
  exports: [EncrypterGateway],
})
export class CryptographyModule {}
