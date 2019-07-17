import { LogLevel } from './LogLevel';
import { Logger, PrependLogStrategy } from './Logger';

export class LoggerFactory {
    constructor(private prependLogStrategy: PrependLogStrategy) {}
    create<T>(x: T & Function): Logger<T> {
        return new Logger<T>(x, this.prependLogStrategy);
    }
}
