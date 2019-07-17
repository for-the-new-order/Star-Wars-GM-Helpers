import { LogLevel } from './LogLevel';

export class Logger<T> {
    private TName: string;

    constructor(x: T & Function, private prependLogStrategy: PrependLogStrategy) {
        this.TName = x.name;
    }
    public warning(value: string): void {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel.warning);
    }
    public error(value: string): void {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel.error);
    }
    public info(value: string): void {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel.info);
    }
    public trace(value: string): void {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel.trace);
    }
    public debug(value: string): void {
        this.prependLogStrategy.prepend(this.TypeName, value, LogLevel.debug);
    }
    public get TypeName(): string {
        return this.TName;
    }
}

export interface PrependLogStrategy {
    prepend(name: string, value: string, logLevel: LogLevel);
}

export class ClientSidePrependLogStrategy implements PrependLogStrategy {
    private logsSelector = '#logs';
    constructor(private minimumLogLevel: LogLevel = LogLevel.trace) {}
    public prepend(name: string, value: string, logLevel: LogLevel) {
        if (this.minimumLogLevel > logLevel) {
            return;
        }
        var $row = $('<div class="row">');
        var $col1 = $('<div class="col-3">');
        var $col2 = $('<div class="col-9">');
        $row.addClass(`level-${logLevel}`);
        $col1.html(name);
        $col2.html(value);
        $col1.appendTo($row);
        $col2.appendTo($row);
        $row.prependTo(this.logsSelector);
    }
}

export class ServerSidePrependLogStrategy implements PrependLogStrategy {
    constructor(private minimumLogLevel: LogLevel = LogLevel.trace) {}

    prepend(name: string, value: string, logLevel: LogLevel) {
        if (this.minimumLogLevel > logLevel) {
            //return;
        }
        const message = `[${name}] ${value}`;
        switch (logLevel) {
            case LogLevel.trace:
                console.trace(message);
                break;
            case LogLevel.debug:
                console.debug(message);
                break;
            case LogLevel.info:
                console.info(message);
                break;
            case LogLevel.warning:
                console.warn(message);
                break;

            case LogLevel.error:
                console.error(message);
                break;
            default:
                console.log(message);
                break;
        }
    }
}
