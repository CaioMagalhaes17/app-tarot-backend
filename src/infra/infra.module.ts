import { Global, Module } from '@nestjs/common';
import { BaseFrontendUrlFactory } from './base-frontend-url.factory';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  providers: [BaseFrontendUrlFactory, AuthModule],
  exports: [BaseFrontendUrlFactory, AuthModule],
})
export class InfraModule {}
