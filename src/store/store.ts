import { Notifier, UnsubscribeFunc } from '@/src/events';

export type IStoreSubscriber<S> = (state: S) => unknown;

export interface IStore<S> {
  setState(update: (state: S) => S, notify?: boolean): void;
  getState(): S;
  notify(): void;
  subscribe(func: IStoreSubscriber<S>): UnsubscribeFunc;
  delete(): void;
}

export class Store<S> implements IStore<S> {
  protected _state: S;
  protected _notifier: Notifier;
  protected _shouldNotify: boolean;

  static create<S>(state: S) {
    return new this(state);
  }

  constructor(state: S) {
    this._state = state;
    this._notifier = new Notifier();
    this._shouldNotify = false;
  }

  setState(update: (state: S) => S, notify = false) {
    const newState = update(this._state);

    if (newState === this._state) return;

    this._state = newState;

    this._shouldNotify = true;

    if (notify) this.notify();
  }

  getState() {
    return this._state;
  }

  notify() {
    if (!this._shouldNotify) return;
    this._notifier.notify(this._state);
    this._shouldNotify = false;
  }

  subscribe(subscriber: IStoreSubscriber<S>) {
    return this._notifier.subscribe(subscriber);
  }

  delete() {
    this._notifier.clear();
  }
}
