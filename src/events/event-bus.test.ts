import { vi } from 'vitest';

import { createEventBus, createSubscriptionForEventBus } from './event-bus';

const defaultEvent = 'event';
const makeEventListeners = () =>
  [
    ['eventA', [vi.fn(), vi.fn()]],
    ['eventB', [vi.fn(), vi.fn()]],
    ['eventC', [vi.fn(), vi.fn()]],
  ] as const;

describe('createEventBus', () => {
  it('should return EventBus instance', () => {
    expect(createEventBus()).toBeInstanceOf(Object);
  });

  describe('EventBus', () => {
    describe('on', () => {
      it('should add event listener to event bus', () => {
        const listener = vi.fn();
        const eventBus = createEventBus();

        eventBus.on(defaultEvent, listener);
        eventBus.emit(defaultEvent);

        expect(listener).toHaveBeenCalled();
      });

      it('should return unsubscribe function, it should unsubscribe listener from registered event after call', () => {
        const eventA = 'eventA';
        const eventB = 'eventB';
        const listener = vi.fn();
        const eventBus = createEventBus();

        const unsubscribeA = eventBus.on(eventA, listener);
        eventBus.on(eventB, listener);

        unsubscribeA();
        eventBus.emit(eventA);
        expect(listener).not.toHaveBeenCalled();

        eventBus.emit(eventB);
        expect(listener).toHaveBeenCalled();
      });
    });

    describe('off', () => {
      it('should unsubscribe listener from provided event', () => {
        const eventA = 'eventA';
        const eventB = 'eventB';
        const listener = vi.fn();
        const eventBus = createEventBus();

        eventBus.on(eventA, listener);
        eventBus.on(eventB, listener);

        eventBus.off(eventA, listener);
        eventBus.emit(eventA);
        expect(listener).not.toHaveBeenCalled();

        eventBus.emit(eventB);
        expect(listener).toHaveBeenCalled();
      });

      it('should do nothing when event bus is empty', () => {
        const listener = vi.fn();
        const eventBus = createEventBus();

        expect(() => {
          eventBus.off(defaultEvent, listener);
        }).not.toThrow();
      });
    });

    describe('emit', () => {
      it('should call provided event listeners with provided args', () => {
        const args = [1, 2];
        const listeners = [vi.fn(), vi.fn()];
        const eventBus = createEventBus();
        listeners.forEach((listener) => eventBus.on(defaultEvent, listener));

        eventBus.emit(defaultEvent, ...args);

        for (const listener of listeners) {
          expect(listener).toHaveBeenCalledWith(...args);
        }
      });

      it('should call listeners of provided event only', () => {
        const eventListeners = makeEventListeners();
        const calledListeners = [eventListeners[0]];
        const notCalledListeners = [eventListeners[1], eventListeners[2]];
        const eventBus = createEventBus();
        eventListeners.forEach(([event, listeners]) => {
          listeners.forEach((listener) => eventBus.on(event, listener));
        });

        calledListeners.forEach(([event]) => eventBus.emit(event));

        calledListeners.forEach(([_, listeners]) => {
          listeners.forEach((listener) => {
            expect(listener).toHaveBeenCalled();
          });
        });
        notCalledListeners.forEach(([_, listeners]) => {
          listeners.forEach((listener) => {
            expect(listener).not.toHaveBeenCalled();
          });
        });
      });

      it('should do nothing when event bus is empty', () => {
        const eventBus = createEventBus();

        expect(() => {
          eventBus.emit(defaultEvent);
        }).not.toThrow();
      });
    });

    describe('removeAllListeners', () => {
      it('should remove all provided event listeners', () => {
        const eventListeners = makeEventListeners();
        const removedListeners = [eventListeners[0], eventListeners[1]] as const;
        const usedListeners = [eventListeners[2]] as const;
        const eventBus = createEventBus();
        eventListeners.forEach(([event, listeners]) => {
          listeners.forEach((listener) => eventBus.on(event, listener));
        });

        eventBus.removeAllListeners(...removedListeners.map(([event]) => event));

        eventListeners.forEach(([event]) => eventBus.emit(event));

        removedListeners.forEach(([_, listeners]) => {
          listeners.forEach((listener) => expect(listener).not.toHaveBeenCalled());
        });
        usedListeners.forEach(([_, listeners]) => {
          listeners.forEach((listener) => expect(listener).toHaveBeenCalled());
        });
      });

      it('should remove all listeners when called without args', () => {
        const eventListeners = makeEventListeners();
        const eventBus = createEventBus();
        eventListeners.forEach(([event, listeners]) => {
          listeners.forEach((listener) => eventBus.on(event, listener));
        });

        eventBus.removeAllListeners();

        eventListeners.forEach(([event]) => eventBus.emit(event));

        eventListeners.forEach(([_, listeners]) => {
          listeners.forEach((listener) => {
            expect(listener).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});

describe('createSubscriptionForEventBus', () => {
  describe('it should return subscribe function', () => {
    it('should add event listener to provided EventBus and listen provided event after call', () => {
      const listener = vi.fn();
      const eventBus = createEventBus();
      const subsribe = createSubscriptionForEventBus(eventBus, defaultEvent);

      subsribe(listener);
      eventBus.emit(defaultEvent);

      expect(listener).toHaveBeenCalled();
    });

    it('should return unsubscribe function, it should remove listener from event bus after call', () => {
      const listener = vi.fn();
      const eventBus = createEventBus();
      const subsribe = createSubscriptionForEventBus(eventBus, defaultEvent);

      const unsubscribe = subsribe(listener);
      unsubscribe();
      eventBus.emit(defaultEvent);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
