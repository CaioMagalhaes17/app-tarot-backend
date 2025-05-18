import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { Feedbacks } from './feedbacks.schema';
import { FeedbacksEntity } from '../feedbacks.entity';

export class FeedbacksMapper
  implements BaseMapperInterface<Feedbacks, FeedbacksEntity> {
  toDomain(row: Feedbacks): FeedbacksEntity {
    if (!row) return;
    const { _id, ...rest } = row.toObject();
    return FeedbacksEntity.create(
      {
        ...rest,
      },
      _id,
    );
  }

  toDomainArray(rows: Feedbacks[]): FeedbacksEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }
}
