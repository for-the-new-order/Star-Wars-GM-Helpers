import { BaseCommand, Command } from '../BaseCommand';
import { RacerRowAccessor, RacerFormFactory, RaceModel, RacerModel } from '.';
import { LoggerFactory } from '../Logging';
import { DiscordInfo } from '../DiscordInfo';

export class RacerCommand extends BaseCommand<RacerCommand> implements RaceModel, Command {
    private racerFormAccessors = new Array<RacerRowAccessor>();
    private rowCount = 0;
    constructor(loggerFactory: LoggerFactory, private symbolsFormAccessorFactory: RacerFormFactory, private discordInfo: DiscordInfo) {
        super(loggerFactory.create(RacerCommand));
    }

    public initialize(): void {
        this.logger.trace('RacerCommand loading');
        this.attachSubmitButton();
        this.attachAddRacerButton();
        this.attachSortInitButton();
        this.attachSortRaceButton();
        this.attachResolveNegativesSymbols();
        this.attachRemoveRowButtons();
        this.attachExistingRacer();
        this.logger.trace('RacerCommand loaded');
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
        $('#displayRacers').on('click', function(e) {
            me.logger.trace('displayRacers:clicked');
            e.preventDefault();
            const data = me.createRaceModel();
            $.ajax({
                url: '/commands/display-racers',
                method: 'POST',
                data: data
            }).done(function(msg) {
                me.logger.info(msg);
                me.logger.trace('displayRacers:posted');
            });
        });
    }

    private createRaceModel(): RaceModel {
        const data = {
            userId: this.discordInfo.userId,
            channelId: this.discordInfo.channelId,
            guildId: this.discordInfo.guildId,
            racers: new Array<RacerModel>()
        };
        this.racerFormAccessors.forEach(row => {
            data.racers.push({
                // Racer
                racer: row.racer,
                skill: row.skill,
                type: row.type,
                // Vehicle
                vehicle: row.vehicle,
                silhouette: row.silhouette,
                currentSpeed: row.currentSpeed,
                maxSpeed: row.maxSpeed,
                handling: row.handling,
                currentSystemStrain: row.currentSystemStrain,
                maxSystemStrain: row.maxSystemStrain,
                currentHull: row.currentHull,
                maxHull: row.maxHull,
                part: row.part,
                lap: row.lap,
                // Symbols
                advantages: row.advantages,
                successes: row.successes,
                triumphs: row.triumphs,
                threats: row.threats,
                failures: row.failures,
                despairs: row.despairs
            });
        });
        return data as RaceModel;
    }

    public get racers(): RacerModel[] {
        return this.racerFormAccessors;
    }
    public set racers(v: RacerModel[]) {
        throw 'NotSupportedException';
    }
}
