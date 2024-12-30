import { Args } from '@/src/core';

export class CommandManagerError extends Error {}

export class InvalidCommandError extends CommandManagerError {
  protected _command: string;

  constructor(message: string, command: string) {
    super(message);
    this._command = command;
  }

  getCommand() {
    return this._command;
  }
}

export class UnknownCommandError extends InvalidCommandError {
  constructor(command: string, message?: string) {
    super(message || `Unknown command ${command}`, command);
  }
}

export class InvalidCommandArgsError extends InvalidCommandError {
  protected _args: Args;

  constructor(command: string, args: Args, message?: string) {
    super(message || `Invalid args provided for ${command} command`, command);
    this._args = args;
  }

  getArgs() {
    return this._args;
  }
}
