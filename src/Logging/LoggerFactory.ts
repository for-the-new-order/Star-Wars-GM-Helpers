import { LogLevel } from './LogLevel';
import { Logger } from './Logger';

export class LoggerFactory {
    create<T>(x: T & Function, minimumLogLevel: LogLevel = LogLevel.trace): Logger<T> {
        return new Logger<T>(x, minimumLogLevel);
    }
}
