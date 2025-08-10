import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';

type FeedbacksProps = {
  senderId: string;
  description: string;
  atendentId: string;
  rating: number;
  createdAt: string;
};

export class FeedbacksEntity extends BaseEntity<FeedbacksProps> {
  static create(props: FeedbacksProps, id: string) {
    return new FeedbacksEntity(props, new UniqueEntityID(id));
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get atendentId(): string {
    return this.props.atendentId;
  }

  get description(): string {
    return this.props.description;
  }

  get rating(): number {
    return this.props.rating;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }
}
