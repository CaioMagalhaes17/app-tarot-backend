import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';

type SpecialitiesProps = {
  topicId: string;
  name: string;
};

export class SpecialitiesEntity extends BaseEntity<SpecialitiesProps> {
  static create(props: SpecialitiesProps, id?: string) {
    return new SpecialitiesEntity(props, new UniqueEntityID(id));
  }

  get name(): string {
    return this.props.name;
  }

  get topicId(): string {
    return this.props.topicId;
  }
}
