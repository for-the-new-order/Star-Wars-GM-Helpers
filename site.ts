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

class SymbolsFormAccessorFactory {
    constructor(private logger: Logger) {}

    public create(index: number): SymbolsFormAccessor {
        var accessor = new SymbolsFormAccessor(index, this.logger);
        var me = this;
        me.logger.trace(`SymbolsFormAccessorFactory:loading:${index}`);
        $.ajax({
            url: '/partials/index-display-symbols-form',
            method: 'GET',
            data: { index: index }
        }).done(function(data) {
            me.logger.trace(`SymbolsFormAccessorFactory:loaded:${index}`);
            const $parent = $('#display-symbols-card');
            const $row = $(data);
            $parent.append($row);
            accessor.load();
        });
        return accessor;
    }
}

class DisplaySymbolsCommandsFormAccessor extends BaseCommandsAccessor implements DisplaySymbolsCommands {
    private symbolsFormAccessors = new Array<SymbolsFormAccessor>();
    private rowCount = 0;
    constructor(defaultDiscordOptions: DiscordOptions, logger: Logger, private symbolsFormAccessorFactory: SymbolsFormAccessorFactory) {
        super(defaultDiscordOptions, logger);
    }

    protected load(): void {
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loading');
        this.addRow();
        this.attachSubmitButton();
        this.attachAddRowButton();
        this.attachSortInitButton();
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loaded');
    }

    private attachSortInitButton() {
        const me = this;
        $('#sortInit').on('click', function(e) {
            me.logger.trace('sortInit:clicked');
            e.preventDefault();
            me.symbolsFormAccessors = me.symbolsFormAccessors
                .sort(
                    (a, b) =>
                        me.sortCompound(a.successes, b.successes) ||
                        me.sortCompound(a.advantages, b.advantages) ||
                        me.sortCompound(a.triumphs, b.triumphs)
                )
                .reverse();
            const $parent = $('#display-symbols-card');
            const $rows = $parent.remove('[data-symbols-row]');
            me.symbolsFormAccessors.forEach(element => {
                const index = element.getIndex();
                const selector = `[data-symbols-row="${index}"]`;
                const $el = $(selector, $rows);
                $parent.append($el);
            });
        });
    }

    private sortCompound(a: number, b: number): number {
        if (a > b) return +1;
        if (a < b) return -1;
        return 0;
    }

    private attachAddRowButton() {
        const me = this;
        $('#addSymbolsRow').on('click', function(e) {
            me.logger.trace('addSymbolsRow:clicked');
            e.preventDefault();
            me.addRow();
        });
    }

    private addRow(): void {
        var accessor = this.symbolsFormAccessorFactory.create(this.rowCount++);
        this.symbolsFormAccessors.push(accessor);
        accessor.load();
    }

    private attachSubmitButton() {
        const me = this;
        $('#displaySymbols').on('click', function(e) {
            me.logger.trace('displaySymbols:clicked');
            e.preventDefault();
            const data = {
                userId: me.userId,
                channelId: me.channelId,
                guildId: me.guildId,
                symbols: new Array<Symbols>()
            };
            me.symbolsFormAccessors.forEach(row => {
                data.symbols.push({
                    label: row.label,
                    type: row.type,
                    advantages: row.advantages,
                    successes: row.successes,
                    triumphs: row.triumphs,
                    threats: row.threats,
                    failures: row.failures,
                    despairs: row.despairs
                });
            });
            $.ajax({
                url: '/commands/display-symbols',
                method: 'POST',
                data: data
            }).done(function(msg) {
                me.logger.trace('displaySymbols:posted');
                me.logger.info(msg);
            });
        });
    }

    public get symbols(): Symbols[] {
        return this.symbolsFormAccessors;
    }
    public set symbols(v: Symbols[]) {
        throw 'NotSupportedException';
    }
}

class SymbolsFormAccessor implements Symbols {
    constructor(private index: number, protected logger: Logger) {}

    public load() {
        this.loadDefaults();
        this.attachRemoveButton();
    }

    public getIndex(): number {
        return this.index;
    }

    private attachRemoveButton() {
        var me = this;
        $(`[data-index="${me.index}"]`).on('click', function() {
            $(`[data-symbols-row="${me.index}"]`).remove();
        });
    }

    private loadDefaults() {
        this.type = 'NPC';
        this.advantages = 0;
        this.successes = 0;
        this.triumphs = 0;
        this.threats = 0;
        this.failures = 0;
        this.despairs = 0;
    }

    public get label(): string {
        return $(`#label-${this.index}`).val() as string;
    }
    public set label(v: string) {
        this.logger.debug(`Setting label to ${v}`);
        $(`#label-${this.index}`).val(v);
    }

    public get type(): string {
        return $(`#type-${this.index}`).val() as string;
    }
    public set type(v: string) {
        this.logger.debug(`Setting type to ${v}`);
        $(`#type-${this.index}`).val(v);
    }

    public get advantages(): number {
        return $(`#advantages-${this.index}`).val() as number;
    }
    public set advantages(v: number) {
        this.logger.debug(`Setting advantages to ${v}`);
        $(`#advantages-${this.index}`).val(v);
    }

    public get successes(): number {
        return $(`#successes-${this.index}`).val() as number;
    }
    public set successes(v: number) {
        this.logger.debug(`Setting successes to ${v}`);
        $(`#successes-${this.index}`).val(v);
    }

    public get triumphs(): number {
        return $(`#triumphs-${this.index}`).val() as number;
    }
    public set triumphs(v: number) {
        this.logger.debug(`Setting triumphs to ${v}`);
        $(`#triumphs-${this.index}`).val(v);
    }

    public get threats(): number {
        return $(`#threats-${this.index}`).val() as number;
    }
    public set threats(v: number) {
        this.logger.debug(`Setting threats to ${v}`);
        $(`#threats-${this.index}`).val(v);
    }

    public get failures(): number {
        return $(`#failures-${this.index}`).val() as number;
    }
    public set failures(v: number) {
        this.logger.debug(`Setting failures to ${v}`);
        $(`#failures-${this.index}`).val(v);
    }

    public get despairs(): number {
        return $(`#despairs-${this.index}`).val() as number;
    }
    public set despairs(v: number) {
        this.logger.debug(`Setting despairs to ${v}`);
        $(`#despairs-${this.index}`).val(v);
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
const symbolsFormAccessorFactory = new SymbolsFormAccessorFactory(logger);
const displaySymbolsCommandsFormAccessor = new DisplaySymbolsCommandsFormAccessor(discordOptions, logger, symbolsFormAccessorFactory);
const commands = [formAccessor, displaySymbolsCommandsFormAccessor];
const main = new Main(commands, logger);

$(() => {
    main.initialize();
});
