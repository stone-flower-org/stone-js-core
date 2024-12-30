import { IWithEventProducer, WithEventProducer } from '@/src/events';

export interface IClock extends IWithEventProducer {
  isRunning(): boolean;
  getElapsedTime(): number;
  start(): void;
  stop(): void;
  continue(): void;
  delete(): void;
}

export class Clock extends WithEventProducer(Function) implements IClock {
  _isRunning = false;
  _startedAt = 0;
  _lastMeasureAt = 0;
  _elapsedTime = 0;

  static get EVENTS() {
    return {
      start: 'start',
      stop: 'stop',
      delete: 'delete',
      pause: 'pause',
      continue: 'continue',
    };
  }

  static create() {
    return new this();
  }

  isRunning() {
    return this._isRunning;
  }

  getElapsedTime() {
    if (!this._isRunning) return this._elapsedTime;

    const now = this._now();
    this._elapsedTime += now - this._lastMeasureAt;
    this._lastMeasureAt = now;

    return this._elapsedTime;
  }

  start() {
    this._isRunning = true;
    this._startedAt = this._now();
    this._lastMeasureAt = this._startedAt;
    this._elapsedTime = 0;
    this._eventBus.emit(Clock.EVENTS.start, this);
  }

  stop() {
    this.getElapsedTime();
    this._isRunning = false;
    this._eventBus.emit(Clock.EVENTS.stop, this);
  }

  continue() {
    this._isRunning = true;
    this._lastMeasureAt = this._now();
    this._eventBus.emit(Clock.EVENTS.continue, this);
  }

  delete() {
    this.stop();
    this._eventBus.emit(Clock.EVENTS.delete, this);
    this.removeAllListeners();
  }

  protected _now() {
    return Date.now();
  }
}
