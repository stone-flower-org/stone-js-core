import { createEventBus, EventBus, createSubscriptionForEventBus, SubscribeFunc } from '@/src/events';

export type ProgressSubscribeArgs = [Progress];

export interface Progress {
  advance(step?: number): void;
  retreat(step?: number): void;
  finish(): void;
  reset(): void;
  isFinished(): boolean;
  getProgress(): number;
  getStep(): number;
  getTotalSteps(): number;
  subscribe: SubscribeFunc<ProgressSubscribeArgs>;
}

export interface ProgressOptions {
  totalSteps: number;
  step: number;
}

export interface ProgressCtx {
  options: ProgressOptions;
  step: number;
  eventBus: EventBus;
}

export const DEFAULT_PROGRESS_OPTIONS = {
  totalSteps: 1,
  step: 0,
};

export const createProgress = (_options: Partial<ProgressOptions> = {}): Progress => {
  const options = { ...DEFAULT_PROGRESS_OPTIONS, ..._options };

  let step = options.step;
  if (step < 0 || step > options.totalSteps) throw new Error('provided step must be between 0 and totalSteps');

  const eventBus = createEventBus();

  return {
    advance: function (_step = 1) {
      step = Math.min(options.totalSteps, step + _step);
      eventBus.emit('change', this);
    },
    retreat: function (_step = 1) {
      step = Math.max(0, step - _step);
      eventBus.emit('change', this);
    },
    finish: function () {
      step = options.totalSteps;
      eventBus.emit('change', this);
    },
    reset: function () {
      step = 0;
      eventBus.emit('change', this);
    },
    isFinished: function () {
      return step === options.totalSteps;
    },
    getProgress: function () {
      return step / options.totalSteps;
    },
    getStep: function () {
      return step;
    },
    getTotalSteps: function () {
      return options.totalSteps;
    },
    subscribe: createSubscriptionForEventBus<ProgressSubscribeArgs>(eventBus, 'change'),
  };
};
