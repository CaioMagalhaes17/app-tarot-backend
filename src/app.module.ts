import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from './infra/infra.module';
import { UserModule } from './user/user.module';
import { MongoModule } from './infra/database/mongo.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    InfraModule,
    UserModule,
    MongoModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
