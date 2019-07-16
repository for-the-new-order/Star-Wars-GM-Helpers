import { LogLevel } from './LogLevel';

export class Logger<T> {
    private TName: string;
    private logsSelector = '#logs';
    constructor(x: T & Function, private minimumLogLevel: LogLevel) {
        this.TName = x.name;
    }
    public warning(value: string): void {
        this.prepend(value, LogLevel.warning);
    }
    public error(value: string): void {
        this.prepend(value, LogLevel.error);
    }
    public info(value: string): void {
        this.prepend(value, LogLevel.info);
    }
    public trace(value: string): void {
        this.prepend(value, LogLevel.trace);
    }
    public debug(value: string): void {
        this.prepend(value, LogLevel.debug);
    }
    private prepend(value: string, logLevel: LogLevel) {
        if (this.minimumLogLevel > logLevel) {
            return;
        }
        var $row = $('<div class="row">');
        var $col1 = $('<div class="col-3">');
        var $col2 = $('<div class="col-9">');
        $row.addClass(`level-${logLevel}`);
        $col1.html(this.TName);
        $col2.html(value);
        $col1.appendTo($row);
        $col2.appendTo($row);
        $row.prependTo(this.logsSelector);
    }
    public get TypeName(): string {
        return this.TName;
    }
}
