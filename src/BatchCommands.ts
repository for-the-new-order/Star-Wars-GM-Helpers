import { BaseCommands } from './BaseCommands';

export interface BatchCommands extends BaseCommands {
    chatCommands: string[];
}
