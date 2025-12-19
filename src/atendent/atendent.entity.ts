import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';
import { UserEntity } from 'src/user/user.entity';

export type WorkRange = {
  start: string;
  end: string;
};

export type Weekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type Schedule = Record<Weekday, WorkRange[]>;

export type AtendentProps = {
  user: UserEntity;
  name: string;
  bio: string;
  rating: number;
  schedule: Schedule;
};

export class AtendentEntity extends BaseEntity<AtendentProps> {
  static create(props: AtendentProps, id?: string) {
    return new AtendentEntity(props, new UniqueEntityID(id));
  }

  get user(): UserEntity {
    return this.props.user;
  }

  get name() {
    return this.props.name;
  }

  get bio() {
    return this.props.bio;
  }

  get rating() {
    return this.props.rating;
  }

  get schedule() {
    return this.props.schedule;
  }

  update(props: Partial<AtendentEntity>) {
    if (props.bio) {
      this.props.bio = props.bio;
    }

    if (props.rating) {
      this.props.rating = props.rating;
    }

    if (props.name) {
      this.props.name = props.name;
    }

    if (props.schedule) {
      this.props.schedule = props.schedule;
    }
  }
}
