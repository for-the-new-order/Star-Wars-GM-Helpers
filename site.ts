import { DiscordOptions } from './DiscordOptions';
import { BatchCommands } from './BatchCommands';
import { BaseCommands } from './BaseCommands';
import { DisplaySymbolsCommands } from './DisplaySymbolsCommands';
import { Symbols } from './Symbols';

const config = require('./config').configuration;

class Main {
    constructor(private commands: BaseCommands[], private logger: Logger) {}
    public initialize() {
        this.logger.trace('Main initializing');
        this.commands.forEach(command => {
            command.initialize();
        });
        this.logger.trace('Main initialized');
    }
}

abstract class BaseCommandsAccessor implements BaseCommands {
    constructor(protected defaultDiscordOptions: DiscordOptions, protected logger: Logger) {}

    public initialize(): void {
        this.logger.trace('BaseCommandsAccessor initializing');
        this.userId = this.defaultDiscordOptions.userId;
        this.channelId = this.defaultDiscordOptions.channelId;
        this.guildId = this.defaultDiscordOptions.guildId;
        this.load();
        this.logger.trace('BaseCommandsAccessor initialized');
    }

    protected abstract load(): void;

    public get userId(): string {
        return $('#discordUserId').val() as string;
    }
    public set userId(v: string) {
        this.logger.debug(`Setting userId to ${v}`);
        $('#discordUserId').val(v);
    }

    public get channelId(): string {
        return $('#discordChannelId').val() as string;
    }
    public set channelId(v: string) {
        this.logger.debug(`Setting channelId to ${v}`);
        $('#discordChannelId').val(v);
    }

    public get guildId(): string {
        return $('#discordGuildId').val() as string;
    }
    public set guildId(v: string) {
        this.logger.debug(`Setting discordGuildId to ${v}`);
        $('#discordGuildId').val(v);
    }
}

class BatchCommandsFormAccessor extends BaseCommandsAccessor implements BatchCommands {
    private chatCommandsSelector = '#chatCommands';

    protected load(): void {
        this.logger.trace('BatchCommandsFormAccessor loading');
        const me = this;
        $('#submitMessages').on('click', function(e) {
            me.logger.trace('BatchCommands:clicked');
            e.preventDefault();
            $.ajax({
                url: '/commands/batch',
                method: 'POST',
                data: {
                    userId: me.userId,
                    channelId: me.channelId,
                    guildId: me.guildId,
                    chatCommands: me.chatCommands
                }
            }).done(function(msg) {
                me.logger.trace('BatchCommands:posted');
                me.logger.info(msg);
            });
        });
        this.logger.trace('BatchCommandsFormAccessor loaded');
    }

    public get chatCommands(): string[] {
        const raw = $(this.chatCommandsSelector).val() as string;
        const commands = raw.replace('\r', '').split('\n');
        return commands;
    }
    public set chatCommands(v: string[]) {
        this.logger.debug(`Setting chatCommands to ${v}`);
        const commands = v.join('\n');
        $(this.chatCommandsSelector).val(commands);
    }
}

class DisplaySymbolsCommandsFormAccessor extends BaseCommandsAccessor implements DisplaySymbolsCommands {
    constructor(defaultDiscordOptions: DiscordOptions, logger: Logger, private symbolsFormAccessor: SymbolsFormAccessor) {
        super(defaultDiscordOptions, logger);
    }

    protected load(): void {
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loading');
        this.symbolsFormAccessor.loadDefaults();
        const me = this;
        $('#displaySymbols').on('click', function(e) {
            me.logger.trace('DisplaySymbolsCommands:clicked');
            e.preventDefault();
            $.ajax({
                url: '/commands/display-symbols',
                method: 'POST',
                data: {
                    userId: me.userId,
                    channelId: me.channelId,
                    guildId: me.guildId,
                    label: me.label,
                    symbols: {
                        advantages: me.symbols.advantages,
                        successes: me.symbols.successes,
                        triumphs: me.symbols.triumphs,
                        threats: me.symbols.threats,
                        failures: me.symbols.failures,
                        despairs: me.symbols.despairs
                    }
                }
            }).done(function(msg) {
                me.logger.trace('DisplaySymbolsCommands:posted');
                me.logger.info(msg);
            });
        });
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loaded');
    }

    public get symbols(): Symbols {
        return this.symbolsFormAccessor;
    }
    public set symbols(v: Symbols) {
        throw 'NotSupportedException';
    }

    public get label(): string {
        return $('#label').val() as string;
    }
    public set label(v: string) {
        this.logger.debug(`Setting label to ${v}`);
        $('#label').val(v);
    }
}

class SymbolsFormAccessor implements Symbols {
    constructor(protected logger: Logger) {}

    public loadDefaults() {
        this.advantages = 0;
        this.successes = 0;
        this.triumphs = 0;
        this.threats = 0;
        this.failures = 0;
        this.despairs = 0;
    }

    public get advantages(): number {
        return $('#advantages').val() as number;
    }
    public set advantages(v: number) {
        this.logger.debug(`Setting advantages to ${v}`);
        $('#advantages').val(v);
    }

    public get successes(): number {
        return $('#successes').val() as number;
    }
    public set successes(v: number) {
        this.logger.debug(`Setting successes to ${v}`);
        $('#successes').val(v);
    }

    public get triumphs(): number {
        return $('#triumphs').val() as number;
    }
    public set triumphs(v: number) {
        this.logger.debug(`Setting triumphs to ${v}`);
        $('#triumphs').val(v);
    }

    public get threats(): number {
        return $('#threats').val() as number;
    }
    public set threats(v: number) {
        this.logger.debug(`Setting threats to ${v}`);
        $('#threats').val(v);
    }

    public get failures(): number {
        return $('#failures').val() as number;
    }
    public set failures(v: number) {
        this.logger.debug(`Setting failures to ${v}`);
        $('#failures').val(v);
    }

    public get despairs(): number {
        return $('#despairs').val() as number;
    }
    public set despairs(v: number) {
        this.logger.debug(`Setting despairs to ${v}`);
        $('#despairs').val(v);
    }
}

class Logger {
    private logsSelector = '#logs';
    constructor(private minimumLogLevel: LogLevel = LogLevel.trace) {}

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
        var $li = $('<li>');
        $li.addClass(`level-${logLevel}`);
        $li.html(value);
        $li.prependTo(this.logsSelector);
    }
}

enum LogLevel {
    trace,
    debug,
    info,
    warning,
    error
}

const logger = new Logger();
const discordOptions = config.discord as DiscordOptions;
const formAccessor = new BatchCommandsFormAccessor(discordOptions, logger);
const symbolsFormAccessor = new SymbolsFormAccessor(logger);
const displaySymbolsCommandsFormAccessor = new DisplaySymbolsCommandsFormAccessor(discordOptions, logger, symbolsFormAccessor);
const commands = [formAccessor, displaySymbolsCommandsFormAccessor];
const main = new Main(commands, logger);

$(() => {
    main.initialize();
});
