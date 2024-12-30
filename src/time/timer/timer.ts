import { Clock, IClock } from '@/src/time/clock';

export interface ITimer extends IClock {
  setScheduledTime(time: number): void;
  getScheduledTime(): number;
  getTimeleft(): number;
  getProgress(): number;
}

export interface ITimerOptions {
  scheduledTime?: number;
}

export class Timer extends Clock implements ITimer {
  protected _scheduledTime = 0;

  static create() {
    return new this();
  }

  constructor({ scheduledTime = 0 }: ITimerOptions = {}) {
    super();
    this._scheduledTime = scheduledTime;
  }

  setScheduledTime(time: number) {
    this._scheduledTime = time;
  }

  getScheduledTime() {
    return this._scheduledTime;
  }

  getTimeleft() {
    return this._scheduledTime - this.getElapsedTime();
  }

  getProgress() {
    if (!this._scheduledTime) return 0;
    return this.getElapsedTime() / this._scheduledTime;
  }
}
