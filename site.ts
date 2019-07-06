import { DiscordOptions } from './DiscordOptions';
import { BatchCommands } from './BatchCommands';

const config = require('./config').configuration;

class Main {
    constructor(private commandManager: CommandManager, private formAccessor: FormAccessor, private logger: Logger) {}
    public initialize() {
        this.logger.trace('Main initializing');
        this.formAccessor.loadDefaults();
        this.commandManager.initialize();
        this.logger.trace('Main initialized');
    }
}

class CommandManager {
    constructor(private batchCommands: BatchCommands, private logger: Logger) {}

    public initialize() {
        const myLogger = this.logger;
        myLogger.trace('CommandManager initializing');
        const batchCommands = this.batchCommands;
        $('#submitMessages').on('click', function(e) {
            logger.trace('Execute commands:clicked');
            e.preventDefault();
            $.ajax({
                url: '/command',
                method: 'POST',
                data: {
                    userId: batchCommands.userId,
                    channelId: batchCommands.channelId,
                    chatCommands: batchCommands.chatCommands
                }
            }).done(function(msg) {
                logger.trace('Execute commands:clicked:done');
                logger.info(msg);
            });
        });
        myLogger.trace('CommandManager initialized');
    }
}

class FormAccessor implements BatchCommands {
    private discordUserIdSelector = '#discordUserId';
    private discordChannelIdSelector = '#discordChannelId';
    private chatCommandsSelector = '#chatCommands';

    constructor(private defaultDiscordOptions: DiscordOptions, private logger: Logger) {}

    public loadDefaults() {
        this.logger.trace('FormAccessor loading defaults');
        this.userId = this.defaultDiscordOptions.userId;
        this.channelId = this.defaultDiscordOptions.channelId;
        this.logger.trace('FormAccessor loaded defaults');
    }

    public get userId(): string {
        return $(this.discordUserIdSelector).val() as string;
    }
    public set userId(v: string) {
        this.logger.debug(`Setting userId to ${v}`);
        $(this.discordUserIdSelector).val(v);
    }

    public get channelId(): string {
        return $(this.discordChannelIdSelector).val() as string;
    }
    public set channelId(v: string) {
        this.logger.debug(`Setting channelId to ${v}`);
        $(this.discordChannelIdSelector).val(v);
    }

    public get chatCommands(): string {
        return $(this.chatCommandsSelector).val() as string;
    }
    public set chatCommands(v: string) {
        this.logger.debug(`Setting chatCommands to ${v}`);
        $(this.chatCommandsSelector).val(v);
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
const formAccessor = new FormAccessor(discordOptions, logger);
const commandManager = new CommandManager(formAccessor, logger);
const main = new Main(commandManager, formAccessor, logger);

$(() => {
    setTimeout(() => {
        main.initialize();
    }, 1);
});
