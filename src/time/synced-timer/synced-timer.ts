import { IWithSyncedClock, WithSyncedClock } from '@/src/time/synced';
import { ITimer, Timer } from '@/src/time/timer';

export interface ISyncedTimer extends IWithSyncedClock<ITimer> {}

export interface ISyncedTimerOptions {
  scheduledTime?: number;
}

export class SyncedTimer extends WithSyncedClock(Timer) implements ISyncedTimer {
  static create() {
    return new this();
  }
}
