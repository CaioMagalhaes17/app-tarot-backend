import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from './infra/infra.module';
import { UserModule } from './user/user.module';
import { MongoModule } from './infra/database/mongo.module';
import { EmailModule } from './email/email.module';
import { ServicesModule } from './services/services.module';
import { AtendentModule } from './atendent/atendent.module';

@Module({
  imports: [
    InfraModule,
    UserModule,
    MongoModule,
    EmailModule,
    ServicesModule,
    AtendentModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
