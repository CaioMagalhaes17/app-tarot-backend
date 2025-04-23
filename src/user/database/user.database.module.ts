import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from './user.schema';
import { UserMapper } from './user.mapper';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserMapper,
    {
      provide: UserRepository,
      useFactory: (model: Model<User>, mapper: UserMapper) => {
        return new UserRepository(model, mapper);
      },
      inject: [getModelToken(User.name), UserMapper],
    },
  ],
  exports: [UserRepository],
})
export class UserDatabaseModule {}
