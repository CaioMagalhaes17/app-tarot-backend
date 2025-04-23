import { BaseEntity } from 'src/core/base.entity';

type UserProps = {
  createdAt: string;
  updatedAt: string;
  login: string;
  password: string;
  name: string;
  isAtendent: boolean;
  permission: string;
};

export class UserEntity extends BaseEntity<UserProps> {
  static create(props: UserProps, id: string) {
    return new UserEntity(props, id);
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
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
}
