import { BaseView } from '../BaseView';
import { View } from '../View';
import { LoggerFactory, Logger } from '../Logging';
import { DiscordInfo } from '../DiscordInfo';
import { InitiativeCharacterViewModel } from '.';

export class InitiativeView extends BaseView<InitiativeView> implements View {
    private rows = new Array<InitiativeRowAccessor>();
    private rowCount = 0;

    constructor(private loggerFactory: LoggerFactory, private discordInfo: DiscordInfo) {
        super(loggerFactory.create(InitiativeView));
    }

    public initialize(): void {
        this.logger.trace('InitiativeView loading');
        this.loadExistingRows();
        this.attachAddCharacter();
        this.attachDeleteOneCharacter();
        this.logger.trace('InitiativeView loaded');
    }

    private loadExistingRows() {
        this.logger.trace('loadExistingRows');
        var me = this;
        $('[data-init-row]').each(function() {
            var rawIndex = $(this).attr('data-init-row');
            var index = parseInt(rawIndex);
            var row = new InitiativeRowAccessor(index, me.loggerFactory);
            me.rows.push(row);
            me.rowCount++;
        });
    }

    private attachAddCharacter() {
        this.logger.trace('attachAddCharacter');
        var me = this;
        $('[data-command="addCharacter"]').on('click', function(e) {
            e.preventDefault();
            me.logger.trace('Add Character clicked');
            const index = me.rowCount++;
            const row = new InitiativeRowAccessor(index, me.loggerFactory);
            $.ajax({
                url: '/partials/initiative-row',
                method: 'GET',
                data: { index: index }
            }).done(function(data) {
                me.logger.trace(`Character row '${index}' loaded`);
                const $parent = $('#display-characters-card');
                const $row = $(data);
                $parent.append($row);
                me.logger.trace(`Character row '${index}' added`);
            });
            me.rows.push(row);
        });
    }

    private attachDeleteOneCharacter() {
        this.logger.trace('attachDeleteOneCharacter');
        const me = this;
        $(document).on('click', '[data-command="delete-row"]', function(e) {
            e.preventDefault();
            var index = $(this).attr('data-index');
            if (confirm('Are you sure that you want to delete this row?')) {
                me.logger.trace(`Deleting the row '${index}'.`);
                $(`[data-init-row="${index}"]`).remove();
            } else {
                me.logger.trace(`Deletion of row '${index}' aborted by the user.`);
            }
        });
    }

    private findRow(index: number): InitiativeRowAccessor {
        return this.rows.find(x => x.getIndex() == index);
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
