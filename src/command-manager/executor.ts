import { Args } from '@/src/core';

export type IExecutor<O = unknown> = (...args: Args) => Promise<O> | O;
