import { BaseEntity } from 'src/core/base.entity';

type SpecialitiesProps = {
  topicId: string;
  name: string;
};

export class SpecialitiesEntity extends BaseEntity<SpecialitiesProps> {
  static create(props: SpecialitiesProps, id: string) {
    return new SpecialitiesEntity(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get topicId(): string {
    return this.props.topicId;
  }
}
