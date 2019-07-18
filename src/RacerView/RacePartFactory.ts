import { Logger, LoggerFactory } from '../Logging';
import { RacerFormFactory } from './RacerFormFactory';
import { RacePartAccessor } from './RacePartAccessor';
export class RacePartFactory {
    private logger: Logger<RacerFormFactory>;
    constructor(private loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(RacerFormFactory);
    }

    public attach(): Array<RacePartAccessor> {
        var me = this;
        const accessors = new Array<RacePartAccessor>();
        $('[data-race-part]').each(function() {
            const $row = $(this);
            const index = parseInt($row.attr('data-race-part'));
            me.logger.trace(`RacePartFactory:attaching:${index}`);
            const accessor = new RacePartAccessor(index, me.loggerFactory);
            accessors.push(accessor);
        });
        return accessors;
    }
}
