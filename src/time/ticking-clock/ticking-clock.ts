import { Clock, IClock } from '@/src/time/clock';

export interface ITickingClock extends IClock {
  tick(): ITick;
  getLastTick(): ITick | undefined;
}

export interface ITick {
  clock: IClock;
  deltaTime: number;
  elapsedTime: number;
  time: number;
}

export class TickingClock extends Clock implements ITickingClock {
  protected _lastTickElapsedTime = 0;
  protected _lastTick: ITick = {
    clock: this,
    deltaTime: 0,
    elapsedTime: 0,
    time: this._now(),
  };

  static get EVENTS() {
    return {
      ...Clock.EVENTS,
      tick: 'tick',
    };
  }

  static create() {
    return new this();
  }

  start() {
    this._lastTickElapsedTime = 0;
    super.start();
  }

  tick() {
    const elapsedTime = this.getElapsedTime();
    const tick: ITick = {
      clock: this,
      deltaTime: 0,
      elapsedTime,
      time: this._lastMeasureAt,
    };

    if (this._isRunning) {
      tick.deltaTime = tick.elapsedTime - this._lastTickElapsedTime;
      this._lastTickElapsedTime = tick.elapsedTime;
    }

    this._lastTick = tick;

    this._eventBus.emit(TickingClock.EVENTS.tick, tick, this);

    return tick;
  }

  getLastTick() {
    return this._lastTick;
  }
}
