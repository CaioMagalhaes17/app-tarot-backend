import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';

export type UserProps = {
  createdAt?: Date;
  updatedAt?: Date;
  login: string;
  password?: string;
  name: string;
  isAtendent: boolean;
  permission: string;
  profileImg: string;
  isVerified: boolean;
  googleId?: string;
};

export class UserEntity extends BaseEntity<UserProps> {
  static createFromGoogle(
    googleId: string,
    name: string,
    email: string,
    id?: string,
  ): UserEntity {
    return new UserEntity(
      {
        isAtendent: false,
        isVerified: true,
        login: email,
        name,
        permission: 'user',
        profileImg: '',
        googleId,
      },
      new UniqueEntityID(id),
    );
  }

  static create(props: UserProps, id?: string) {
    return new UserEntity(props, new UniqueEntityID(id));
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get googleId() {
    return this.props.googleId;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get login(): string {
    return this.props.login;
  }

  get password(): string {
    return this.props.password;
  }

  get name(): string {
    return this.props.name;
  }

  get isAtendent(): boolean {
    return this.props.isAtendent;
  }

  get permission(): string {
    return this.props.permission;
  }

  get profileImg(): string {
    return this.props.profileImg;
  }

  get isVerified(): boolean {
    return this.props.isVerified;
  }

  update(data: Partial<UserEntity>) {
    if (data.isVerified) {
      this.props.isVerified = data.isVerified;
    }
    if (data.name) {
      this.props.name = data.name;
    }

    if (data.password) {
      this.props.password = data.password;
    }
    this.touch();
  }

  touch() {
    this.props.updatedAt = new Date();
  }
}
