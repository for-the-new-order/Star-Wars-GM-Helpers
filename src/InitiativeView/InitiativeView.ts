import { BaseView } from '../BaseView';
import { View } from '../View';
import { LoggerFactory, Logger } from '../Logging';
import { DiscordInfo } from '../DiscordInfo';
import { InitiativeCharacterViewModel } from '.';

export class InitiativeView extends BaseView<InitiativeView> implements View {
    private rows = new Array<InitiativeRowAccessor>();
    constructor(private loggerFactory: LoggerFactory, private discordInfo: DiscordInfo) {
        super(loggerFactory.create(InitiativeView));
    }

    public initialize(): void {
        this.logger.trace('InitiativeView loading');
        this.loadExistingRows();
        this.attachAddCharacter();
        this.logger.trace('InitiativeView loaded');
    }

    private loadExistingRows() {
        var me = this;
        $('[data-init-row]').each(function() {
            var rawIndex = $(this).attr('data-init-row');
            var index = parseInt(rawIndex);
            var row = new InitiativeRowAccessor(index, me.loggerFactory);
            me.rows.push(row);
        });
    }

    private attachAddCharacter() {
        const index = this.rows.length;
        var me = this;
        $('[data-command="addCharacter"]').on('click', function(e) {
            me.logger.trace('Add Character clicked');
            e.preventDefault();
            $.ajax({
                url: '/partials/initiative-row',
                method: 'GET',
                data: { index: index }
            }).done(function(data) {
                me.logger.trace(`Character row '${index}' loaded`);
                const $parent = $('#display-characters-card');
                const $row = $(data);
                $parent.append($row);
                var row = new InitiativeRowAccessor(index, me.loggerFactory);
                me.rows.push(row);
                me.logger.trace(`Character row '${index}' added`);
            });
        });
    }
}

class InitiativeRowAccessor implements InitiativeCharacterViewModel {
    protected logger: Logger<InitiativeRowAccessor>;
    constructor(private index: number, loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(InitiativeRowAccessor);
    }

    public getIndex(): number {
        return this.index;
    }

    public get name(): string {
        return $(`#name-${this.index}`).val() as string;
    }
    public set name(v: string) {
        this.logger.debug(`Setting name to ${v}`);
        $(`#name-${this.index}`).val(v);
    }

    public get skill(): string {
        return $(`#skill-${this.index}`).val() as string;
    }
    public set skill(v: string) {
        this.logger.debug(`Setting skill to ${v}`);
        $(`#skill-${this.index}`).val(v);
    }

    public get type(): string {
        return $(`#type-${this.index}`).val() as string;
    }
    public set type(v: string) {
        this.logger.debug(`Setting type to ${v}`);
        $(`#type-${this.index}`).val(v);
    }

    //
    // Symbols
    //
    public get advantages(): number {
        return parseInt($(`#advantages-${this.index}`).val() as string);
    }
    public set advantages(v: number) {
        this.logger.debug(`Setting advantages to ${v}`);
        $(`#advantages-${this.index}`).val(v);
    }

    public get successes(): number {
        return parseInt($(`#successes-${this.index}`).val() as string);
    }
    public set successes(v: number) {
        this.logger.debug(`Setting successes to ${v}`);
        $(`#successes-${this.index}`).val(v);
    }

    public get triumphs(): number {
        return parseInt($(`#triumphs-${this.index}`).val() as string);
    }
    public set triumphs(v: number) {
        this.logger.debug(`Setting triumphs to ${v}`);
        $(`#triumphs-${this.index}`).val(v);
    }

    public convertToViewModel(): InitiativeCharacterViewModel {
        return {
            name: this.name,
            skill: this.skill,
            type: this.type,
            successes: this.successes,
            advantages: this.advantages,
            triumphs: this.triumphs
        };
    }
}
/*
[data-command="roll-initiative"] => [data-index]

[data-command="addCharacter"]

[data-command="resetInit"]
[data-command="saveInit"]
[data-command="loadInit"]

[data-command="rollAllInitByType"] => #rollAllInitByTypeValue
[data-command="sortInit"]
[data-command="displayInit"]

[data-command="setIndexRound"]
[data-command="moveNext"]
[data-command="displayNext"]
#currentIndex
#currentRound
*/
