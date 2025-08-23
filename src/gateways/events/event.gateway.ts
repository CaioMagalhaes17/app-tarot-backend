export interface DomainEvent {
  name: string;
  payload: any;
  occurredAt: Date;
}

export abstract class EventGateway {
  abstract publish(event: DomainEvent): Promise<void>;
}
