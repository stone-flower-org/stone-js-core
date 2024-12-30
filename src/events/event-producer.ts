import { Constructor } from '@/src/core';
import { EventBus, IEventBus, ListenerFunc } from '@/src/events';

export interface IEventProducer extends Omit<IEventBus, 'emit'> {}

export type IWithEventProducer<T = object> = IEventProducer & T;

export const WithEventProducer = <S extends Constructor>(superclass: S) =>
  class extends superclass {
    _eventBus = new EventBus();

    on(event: string, listener: ListenerFunc) {
      return this._eventBus.on(event, listener);
    }

    off(event: string, listener: ListenerFunc) {
      this._eventBus.off(event, listener);
    }

    removeAllListeners() {
      this._eventBus.removeAllListeners();
    }
  };
