import { Args } from '@/src/core';

import { UnknownCommandError } from './errors';
import { IExecutor } from './executor';

export interface ICommandManager {
  exec<O = unknown>(command: string, ...args: Args): Promise<O>;
  getCommands(): string[];
  hasCommand(command: string): boolean;
  register(command: string, executor: IExecutor): void;
  unregister(command: string): void;
  delete(): void;
}

export class CommandManager implements ICommandManager {
  _executors: Map<string, IExecutor>;

  static create() {
    return new this();
  }

  constructor() {
    this._executors = new Map();
  }

  async exec<O = unknown>(command: string, ...args: Args) {
    const res = this._getExecutor(command)(...args);
    return (res instanceof Promise ? res : Promise.resolve(res)) as Promise<O>;
  }

  getCommands(): string[] {
    return [...this._executors.keys()];
  }

  hasCommand(command: string) {
    return this._executors.has(command);
  }

  register(command: string, executor: IExecutor) {
    this._executors.set(command, executor);
  }

  unregister(command: string) {
    this._executors.delete(command);
  }

  delete() {
    this._executors.clear();
  }

  protected _getExecutor(command: string) {
    const executor = this._executors.get(command);
    if (!executor) throw new UnknownCommandError(command);
    return executor;
  }
}
