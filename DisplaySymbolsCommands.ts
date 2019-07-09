import { BaseCommands } from './BaseCommands';
import { Symbols } from './Symbols';

export interface DisplaySymbolsCommands extends BaseCommands {
    symbols: Symbols;
    label: string;
}
