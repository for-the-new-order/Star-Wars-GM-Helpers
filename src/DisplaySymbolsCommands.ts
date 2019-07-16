import { BaseCommands } from '../BaseCommands';
import { Racer } from '../Racer';

export interface DisplaySymbolsCommands extends BaseCommands {
    symbols: Racer[];
}
