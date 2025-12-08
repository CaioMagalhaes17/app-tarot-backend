import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Atendent, AtendentSchema } from './atendent.schema';
import { AtendentMapper } from './atendent.mapper';
import { AtendentRepository } from './atendent.repository';
import { UserMapper } from 'src/user/database/user.mapper';
import { UserDatabaseModule } from 'src/user/database/user.database.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Atendent.name, schema: AtendentSchema },
    ]),
    UserDatabaseModule,
  ],
  providers: [
    {
      provide: AtendentMapper,
      useFactory: (userMapper: UserMapper) => {
        return new AtendentMapper(userMapper);
      },
      inject: [UserMapper],
    },
    {
      provide: AtendentRepository,
      useFactory: (model: Model<Atendent>, mapper: AtendentMapper) => {
        return new AtendentRepository(model, mapper);
      },
      inject: [getModelToken(Atendent.name), AtendentMapper],
    },
  ],
  exports: [AtendentRepository, AtendentMapper],
})
export class AtendentDatabaseModule {}
