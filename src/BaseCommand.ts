import { Logger } from './Logging/Logger';

export interface Command {
    initialize(): void;
    identifier: string;
}

export abstract class BaseCommand<T extends Command> implements Command {
    constructor(protected logger: Logger<T>) {}
    public abstract initialize(): void;
    public get identifier(): string {
        return this.logger.TypeName;
    }
}
