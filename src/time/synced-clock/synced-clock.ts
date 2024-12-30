import { Clock, IClock } from '@/src/time/clock';
import { IWithSyncedClock, WithSyncedClock } from '@/src/time/synced';

export interface ISyncedClock extends IWithSyncedClock<IClock> {}

export class SyncedClock extends WithSyncedClock(Clock) implements ISyncedClock {
  static create() {
    return new this();
  }
}
