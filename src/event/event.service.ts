import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private events: any[] = [];

  emit(event: any) {
    this.events.push(event);
    console.log('Event emitted:', event);
  }

  getEvents() {
    return this.events;
  }
}