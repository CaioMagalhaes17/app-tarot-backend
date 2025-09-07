import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent, EventGateway } from './event.gateway';

@Injectable()
export class InfraEventEmitter extends EventGateway {
  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

  async publish(event: DomainEvent): Promise<void> {
    this.eventEmitter.emit(event.name, event);
  }
}
