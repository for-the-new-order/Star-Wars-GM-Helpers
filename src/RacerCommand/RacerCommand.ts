import { SaveRaceModel } from './SaveRaceModel';
import { BaseCommand, Command } from '../BaseCommand';
import { RacerRowAccessor, RacerFormFactory, RaceModel, RacerModel, RacePart } from '.';
import { LoggerFactory, Logger } from '../Logging';
import { DiscordInfo } from '../DiscordInfo';
import { accessSync } from 'fs';
import { RacePartAccessor } from './RacePartAccessor';
import { RacePartFactory } from './RacePartFactory';
import { RollService, DiceRollResult } from '../DiceRoller';
import { RollServiceResult } from '../DiceRoller/RollService';

export class RacerCommand extends BaseCommand<RacerCommand> implements RaceModel, Command {
    private racerFormAccessors = new Array<RacerRowAccessor>();
    private racePartAccessors = new Array<RacePartAccessor>();
    private rowCount = 0;
    constructor(
        loggerFactory: LoggerFactory,
        private racerFormFactory: RacerFormFactory,
        private discordInfo: DiscordInfo,
        private racePartFactory: RacePartFactory,
        private raceService: RaceService
    ) {
        super(loggerFactory.create(RacerCommand));
    }

    public initialize(): void {
        this.logger.trace('RacerCommand loading');
        this.attachSubmitButton();
        this.attachAddRacerButton();
        this.attachSortInitButton();
        this.attachSortRaceButton();
        this.attachResolveAllNegativeSymbolsButton();
        this.attachResolveOneNegativeSymbolsButtons();
        this.attachRemoveRowButtons();
        this.attachExistingRacer();
        this.attachResetButton();
        this.attachSaveButton();
        this.attachLoadButton();
        this.attachRollRaceButtons();
        this.loadExistingParts();
        this.logger.trace('RacerCommand loaded');
    }

    private attachSaveButton() {
        var me = this;
        $('#saveRace').on('click', function() {
            const name = prompt('Enter the race name');
            if (name) {
                const race = me.createRaceModel();
                const data = {
                    name,
                    race,
                    discordInfo: {
                        userId: me.discordInfo.userId,
                        channelId: me.discordInfo.channelId,
                        guildId: me.discordInfo.guildId
                    }
                } as SaveRaceModel;
                me.logger.trace(`Saving race under name '${name}'.`);
                me.logger.debug(JSON.stringify(data));
                $.ajax({
                    url: '/commands/save-race',
                    method: 'POST',
                    data: data
                }).done(function(msg) {
                    me.logger.info(msg);
                    me.logger.trace(`Race '${name}' saved.`);
                });
            } else {
                me.logger.info('Saving race aborted by the user.');
            }
        });
    }
    private attachLoadButton() {
        var me = this;
        $('#loadRace').on('click', function() {
            const name = prompt('Race name');
            if (name) {
                location.assign(`/race?race=${name}`);
            } else {
                me.logger.info('Save race aborted by the user.');
            }
        });
    }

    private attachResetButton() {
        var me = this;
        $('#resetRace').on('click', function() {
            if (confirm('Are you sure that you want to cancel the race? All unsaved changes will be lost forever!')) {
                me.logger.trace('Resetting the race');
                location.assign('/race');
            } else {
                me.logger.info(`Race reset aborted by user.`);
            }
        });
    }

    private attachRemoveRowButtons() {
        const me = this;
        $(document).on('click', '[data-delete="race-row"]', function() {
            var index = $(this).attr('data-index');
            if (confirm('Are you sure that you want to delete this row?')) {
                me.logger.trace(`Deleting the row '${index}'.`);
                $(`[data-symbols-row="${index}"]`).remove();
            } else {
                me.logger.trace(`Deletion of row '${index}' aborted by the user.`);
            }
        });
    }

    private attachResolveAllNegativeSymbolsButton() {
        const me = this;
        $('#resolveNegativesSymbols').on('click', function(e) {
            me.logger.trace('Resolve all negative symbols');
            e.preventDefault();
            me.racerFormAccessors.forEach(accessor => me.raceService.applyNegativeEffects(accessor));
        });
    }

    private attachResolveOneNegativeSymbolsButtons() {
        const me = this;
        $(document).on('click', '[data-resolve="race-negative"]', function(e) {
            const rawIndex = $(this).attr('data-index');
            const index = parseInt(rawIndex);
            me.logger.trace(`Resolve negative symbols of ${index}`);
            e.preventDefault();
            const accessor = me.racerFormAccessors[index];
            if (accessor) {
                me.raceService.applyNegativeEffects(accessor);
            } else {
                me.logger.warning(`The "racerFormAccessors[${index}]" does not exist.`);
            }
        });
    }

    private attachRollRaceButtons() {
        const me = this;
        $(document).on('click', '[data-roll="race"]', function(e) {
            const rawIndex = $(this).attr('data-index');
            e.preventDefault();
            const index = parseInt(rawIndex);
            const accessor = me.racerFormAccessors[index];
            if (accessor) {
                me.logger.trace(`Roll racing skill of index: ${index} | skill: ${accessor.skill}`);
                // TODO
                var rollResult = me.raceService.roll(accessor, me.parts);
                const resultingFaces = rollResult.flattenFaces('|');
                me.logger.debug(`Resulting faces of '${resultingFaces}'.`);
                me.raceService.applyRoll(accessor, rollResult);
                // var tmp = JSON.stringify(rollResult);
                // me.logger.debug(tmp);
                // END TODO
                me.logger.warning('Not fully implemented yet!');
            } else {
                me.logger.warning(`The "racerFormAccessors[${index}]" does not exist.`);
            }
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

    private loadExistingParts() {
        const accessors = this.racePartFactory.attach();
        accessors.forEach(accessor => this.racePartAccessors.push(accessor));
    }

    private attachExistingRacer() {
        var accessors = this.racerFormFactory.attach();
        accessors.forEach(accessor => this.racerFormAccessors.push(accessor));
        this.rowCount = accessors.length;
    }

    private addRacer(): void {
        var accessor = this.racerFormFactory.create(this.rowCount++);
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
            racers: new Array<RacerModel>(),
            parts: new Array<RacePart>()
        };
        this.racers.forEach(row => {
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
        this.parts.forEach(part => data.parts.push(new RacePart(part.name, part.difficulty, part.distance)));
        return data as RaceModel;
    }

    public get racers(): RacerModel[] {
        return this.racerFormAccessors;
    }
    public set racers(v: RacerModel[]) {
        throw 'NotSupportedException';
    }

    public get parts(): RacePart[] {
        return this.racePartAccessors;
    }
    public set parts(v: RacePart[]) {
        throw 'NotSupportedException';
    }
}

export class RaceService {
    private logger: Logger<RaceService>;

    constructor(private rollService: RollService, loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(RaceService);
    }

    public applyNegativeEffects(model: RacerModel): void {
        let successes = model.successes - model.failures;
        let advantages = model.advantages - model.threats;
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
        model.successes = successes;
        model.failures = failures;
        model.advantages = advantages;
        model.threats = threats;
    }

    public roll(model: RacerModel, parts: RacePart[]): RollServiceResult {
        if (model.skill) {
            var dicesToRoll = model.skill;
            this.logger.trace(`Add '${model.racer}' skill of '${model.skill}'.`);

            var currentPart = parts[model.part];
            dicesToRoll += currentPart.difficulty;
            this.logger.trace(`Add '${currentPart.name}' difficulty of '${currentPart.difficulty}'.`);

            this.logger.info(`Rolling '${dicesToRoll}'.`);
            var rollResult = this.rollService.roll(dicesToRoll);
            return rollResult;
        }
        this.logger.warning('No skill to roll');
        return null;
    }

    public applyRoll(model: RacerModel, diceRolled: RollServiceResult): void {
        var rawSymbols = diceRolled.countSymbols();
        var symbols = diceRolled.reduceRoll();
        this.logger.debug('Raw: ' + JSON.stringify(rawSymbols));
        this.logger.debug('Reduced: ' + JSON.stringify(symbols));

        if (symbols.success !== 0) {
            model.successes += symbols.success;
        }
        if (symbols.advantage !== 0) {
            model.advantages += symbols.advantage;
        }
        if (symbols.triumph !== 0) {
            model.triumphs += symbols.triumph;
        }

        if (symbols.failure !== 0) {
            model.failures += symbols.failure;
        }
        if (symbols.threat !== 0) {
            model.threats += symbols.threat;
        }
        if (symbols.despair !== 0) {
            model.despairs += symbols.despair;
        }
    }
}
