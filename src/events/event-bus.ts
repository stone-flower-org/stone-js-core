import { Func } from '@/src/core';

export type SubscribeListenerFunc<A extends unknown[]> = (...args: A) => void;

export type UnsubscribeFunc = () => void;

export type SubscribeFunc<A extends unknown[]> = (listener: SubscribeListenerFunc<A>) => UnsubscribeFunc;

export type ListenerFunc = Func;

export interface EventBus {
  on(event: string, listener: ListenerFunc): UnsubscribeFunc;
  off(event: string, listener: ListenerFunc): void;
  emit(event: string, ...args: unknown[]): void;
  removeAllListeners(...events: string[]): void;
}

export const createEventBus = (): EventBus => {
  const listenersStore: Map<string, Set<ListenerFunc>> = new Map();

  return {
    on: (event: string, listener: ListenerFunc) => {
      let listeners = listenersStore.get(event);

      if (listeners === undefined) {
        listeners = new Set();
        listenersStore.set(event, listeners);
      }

      listeners?.add(listener);

      return () => {
        listeners?.delete(listener);
      };
    },
    off: (event: string, listener: ListenerFunc) => {
      listenersStore.get(event)?.delete(listener);
    },
    emit: (event, ...args) => {
      listenersStore.get(event)?.forEach((listener) => listener(...args));
    },
    removeAllListeners: (...events: string[]) => {
      if (!events.length) {
        listenersStore.clear();
        return;
      }

      events.forEach((event) => listenersStore.delete(event));
    },
  };
};

export const createSubscriptionForEventBus =
  <A extends unknown[]>(eventBus: EventBus, event: string) =>
  (listener: SubscribeListenerFunc<A>) =>
    eventBus.on(event, listener as ListenerFunc);
