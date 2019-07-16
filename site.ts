import { DiscordOptions } from './DiscordOptions';
import { BatchCommands } from './BatchCommands';
import { BaseCommands } from './BaseCommands';
import { DisplaySymbolsCommands } from './DisplaySymbolsCommands';
import { Symbols } from './Symbols';
import { LoggerFactory } from './Logging/LoggerFactory';
import { Logger } from './Logging/Logger';

const config = require('./config').configuration;

class Main {
    private logger: Logger<Main>;
    constructor(private commands: BaseCommands[], loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(Main);
    }
    public initialize() {
        this.logger.trace('Main initializing');
        this.commands.forEach(command => {
            command.initialize();
        });
        this.logger.trace('Main initialized');
    }
}

abstract class BaseCommandsAccessor<T extends BaseCommands> implements BaseCommands {
    constructor(protected logger: Logger<T>) {}

    public abstract initialize(): void;
}

interface DiscordInfo {
    userId: string;
    channelId: string;
    guildId: string;
}

class DiscordAccessor implements DiscordInfo {
    constructor(private logger: Logger<DiscordAccessor>) {}
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

class BatchCommandsFormAccessor extends BaseCommandsAccessor<BatchCommandsFormAccessor> implements BatchCommands {
    private chatCommandsSelector = '#chatCommands';

    constructor(loggerFactory: LoggerFactory, private discordInfo: DiscordInfo) {
        super(loggerFactory.create(BatchCommandsFormAccessor));
    }
    public initialize(): void {
        this.logger.trace('BatchCommandsFormAccessor loading');
        const me = this;
        $('#submitMessages').on('click', function(e) {
            me.logger.trace('BatchCommands:clicked');
            e.preventDefault();
            $.ajax({
                url: '/commands/batch',
                method: 'POST',
                data: {
                    userId: me.discordInfo.userId,
                    channelId: me.discordInfo.channelId,
                    guildId: me.discordInfo.guildId,
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

class RacerFormAccessorFactory {
    private logger: Logger<RacerFormAccessorFactory>;
    constructor(private loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(RacerFormAccessorFactory);
    }

    public create(index: number): SymbolsFormAccessor {
        var accessor = new SymbolsFormAccessor(index, this.loggerFactory);
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
        });
        return accessor;
    }

    public attach(): Array<SymbolsFormAccessor> {
        const accessors = new Array<SymbolsFormAccessor>();
        var me = this;
        $('[data-symbols-row]').each(function() {
            const $row = $(this);
            const index = parseInt($row.attr('data-symbols-row'));
            me.logger.trace(`SymbolsFormAccessorFactory:attaching:${index}`);
            const accessor = new SymbolsFormAccessor(index, me.loggerFactory);
            accessors.push(accessor);
        });
        return accessors;
    }
}

class DisplayRacerCommandsFormAccessor extends BaseCommandsAccessor<DisplayRacerCommandsFormAccessor> implements DisplaySymbolsCommands {
    private racerFormAccessors = new Array<SymbolsFormAccessor>();
    private rowCount = 0;
    constructor(
        loggerFactory: LoggerFactory,
        private symbolsFormAccessorFactory: RacerFormAccessorFactory,
        private discordInfo: DiscordInfo
    ) {
        super(loggerFactory.create(DisplayRacerCommandsFormAccessor));
    }

    public initialize(): void {
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loading');
        this.attachSubmitButton();
        this.attachAddRacerButton();
        this.attachSortInitButton();
        this.attachSortRaceButton();
        this.attachResolveNegativesSymbols();
        this.attachRemoveRowButtons();
        this.attachExistingRacer();
        this.logger.trace('DisplaySymbolsCommandsFormAccessor loaded');
    }
    private attachRemoveRowButtons() {
        $(document).on('click', '[data-index]', function() {
            var index = $(this).attr('data-index');
            $(`[data-symbols-row="${index}"]`).remove();
        });
    }

    private attachResolveNegativesSymbols() {
        const me = this;
        $('#resolveNegativesSymbols').on('click', function(e) {
            me.logger.trace('resolveNegativesSymbols:clicked');
            e.preventDefault();
            me.racerFormAccessors.forEach(accessor => {
                let successes = accessor.successes - accessor.failures;
                let advantages = accessor.advantages - accessor.threats;
                let failures = 0;
                let threats = 0;
                if (successes < 0) {
                    failures = -successes;
                    successes = 0;
                }
                if (advantages < 0) {
                    threats = -advantages;
                    advantages = 0;
                }
                accessor.successes = successes;
                accessor.failures = failures;
                accessor.advantages = advantages;
                accessor.threats = threats;
            });
        });
    }

    private attachSortRaceButton() {
        const me = this;
        $('#sortRace').on('click', function(e) {
            me.logger.trace('sortRace:clicked');
            e.preventDefault();
            me.racerFormAccessors = me.racerFormAccessors
                .sort(
                    (a, b) =>
                        me.sortCompound(a.successes - a.failures, b.successes - b.failures) ||
                        me.sortCompound(a.advantages - a.threats, b.advantages - b.threats) ||
                        me.sortCompound(a.triumphs, b.triumphs) ||
                        me.sortCompound(b.despairs, a.despairs)
                )
                .reverse();
            me.reorderRows();
        });
    }

    private attachSortInitButton() {
        const me = this;
        $('#sortInit').on('click', function(e) {
            me.logger.trace('sortInit:clicked');
            e.preventDefault();
            me.racerFormAccessors = me.racerFormAccessors
                .sort(
                    (a, b) =>
                        me.sortCompound(a.successes, b.successes) ||
                        me.sortCompound(a.advantages, b.advantages) ||
                        me.sortCompound(a.triumphs, b.triumphs)
                )
                .reverse();
            me.reorderRows();
        });
    }

    private reorderRows() {
        const $parent = $('#display-symbols-card');
        const $rows = $parent.remove('[data-symbols-row]');
        this.racerFormAccessors.forEach(element => {
            const index = element.getIndex();
            const selector = `[data-symbols-row="${index}"]`;
            const $el = $(selector, $rows);
            $parent.append($el);
        });
    }

    private sortCompound(a: number, b: number): number {
        if (a > b) return +1;
        if (a < b) return -1;
        return 0;
    }

    private attachAddRacerButton() {
        const me = this;
        $('#addSymbolsRow').on('click', function(e) {
            me.logger.trace('addRacer:clicked');
            e.preventDefault();
            me.addRacer();
        });
    }

    private attachExistingRacer() {
        var accessors = this.symbolsFormAccessorFactory.attach();
        accessors.forEach(accessor => this.racerFormAccessors.push(accessor));
        this.rowCount = accessors.length;
    }

    private addRacer(): void {
        var accessor = this.symbolsFormAccessorFactory.create(this.rowCount++);
        this.racerFormAccessors.push(accessor);
    }

    private attachSubmitButton() {
        const me = this;
        $('#displaySymbols').on('click', function(e) {
            me.logger.trace('displaySymbols:clicked');
            e.preventDefault();
            const data = {
                userId: me.discordInfo.userId,
                channelId: me.discordInfo.channelId,
                guildId: me.discordInfo.guildId,
                symbols: new Array<Symbols>()
            };
            me.racerFormAccessors.forEach(row => {
                data.symbols.push({
                    racer: row.racer,
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
        return this.racerFormAccessors;
    }
    public set symbols(v: Symbols[]) {
        throw 'NotSupportedException';
    }
}

class SymbolsFormAccessor implements Symbols {
    protected logger: Logger<SymbolsFormAccessor>;
    constructor(private index: number, loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(SymbolsFormAccessor);
    }

    public getIndex(): number {
        return this.index;
    }

    public get racer(): string {
        return $(`#racer-${this.index}`).val() as string;
    }
    public set racer(v: string) {
        this.logger.debug(`Setting racer to ${v}`);
        $(`#racer-${this.index}`).val(v);
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

const loggerFactory = new LoggerFactory();
const discordInfo = new DiscordAccessor(loggerFactory.create(DiscordAccessor));
const formAccessor = new BatchCommandsFormAccessor(loggerFactory, discordInfo);
const symbolsFormAccessorFactory = new RacerFormAccessorFactory(loggerFactory);
const displaySymbolsCommandsFormAccessor = new DisplayRacerCommandsFormAccessor(loggerFactory, symbolsFormAccessorFactory, discordInfo);
const commands = [formAccessor, displaySymbolsCommandsFormAccessor];
const main = new Main(commands, loggerFactory);

$(() => {
    main.initialize();
});
