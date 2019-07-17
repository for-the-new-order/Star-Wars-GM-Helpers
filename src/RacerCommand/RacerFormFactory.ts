import { Logger, LoggerFactory } from '../Logging';
import { RacerRowAccessor } from '.';

export class RacerFormFactory {
    private logger: Logger<RacerFormFactory>;
    constructor(private loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(RacerFormFactory);
    }

    public create(index: number): RacerRowAccessor {
        var accessor = new RacerRowAccessor(index, this.loggerFactory);
        var me = this;
        me.logger.trace(`RacerFormFactory:loading:${index}`);
        $.ajax({
            url: '/partials/index-display-symbols-form',
            method: 'GET',
            data: { index: index }
        }).done(function(data) {
            me.logger.trace(`RacerFormFactory:loaded:${index}`);
            const $parent = $('#display-symbols-card');
            const $row = $(data);
            $parent.append($row);
        });
        return accessor;
    }

    public attach(): Array<RacerRowAccessor> {
        const accessors = new Array<RacerRowAccessor>();
        var me = this;
        $('[data-symbols-row]').each(function() {
            const $row = $(this);
            const index = parseInt($row.attr('data-symbols-row'));
            me.logger.trace(`RacerFormFactory:attaching:${index}`);
            const accessor = new RacerRowAccessor(index, me.loggerFactory);
            accessors.push(accessor);
        });
        return accessors;
    }
}
