import { Args } from '@/src/core';

import { ListenerFunc } from './event-bus';
import { UnsubscribeFunc } from './subscription';

export interface INotifier {
  subscribe(listener: ListenerFunc): UnsubscribeFunc;
  notify(...notification: Args): void;
  clear(): void;
}

export class Notifier implements INotifier {
  protected _subscribers = new Set<ListenerFunc>();

  static create() {
    return new this();
  }

  subscribe(listener: ListenerFunc) {
    this._subscribers.add(listener);
    return () => {
      this._subscribers.delete(listener);
    };
  }

  notify(...notification: Args): void {
    this._subscribers.forEach((subscriber) => {
      subscriber(...notification);
    });
  }

  clear() {
    this._subscribers.clear();
  }
}
