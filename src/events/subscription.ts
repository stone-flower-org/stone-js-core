import { EventBus, ListenerFunc } from '@/src/events';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SubscribeListenerFunc<A extends any[]> = (...args: A) => void;

export type UnsubscribeFunc = () => void;

export type SubscribeFunc<A extends any[]> = (listener: SubscribeListenerFunc<A>) => UnsubscribeFunc;

export const createSubscriptionForEventBus =
  <A extends any[]>(eventBus: EventBus, event: string) =>
  (listener: SubscribeListenerFunc<A>) =>
    eventBus.on(event, listener as ListenerFunc);
