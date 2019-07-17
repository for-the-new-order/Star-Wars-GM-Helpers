import { RacePartModel } from './RacePartModel';
import { Logger, LoggerFactory } from '../Logging';

export class RacePartAccessor implements RacePartModel {
    protected logger: Logger<RacePartAccessor>;
    constructor(private index: number, loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(RacePartAccessor);
    }

    public getIndex(): number {
        return this.index;
    }

    public get name(): string {
        return $(`#partName${this.index}`).val() as string;
    }
    public set name(v: string) {
        this.logger.debug(`Setting name to ${v}`);
        $(`#partName${this.index}`).val(v);
    }

    public get difficulty(): string {
        return $(`#partDifficulty${this.index}`).val() as string;
    }
    public set difficulty(v: string) {
        this.logger.debug(`Setting difficulty to ${v}`);
        $(`#partDifficulty${this.index}`).val(v);
    }

    public get distance(): number {
        return parseInt($(`#partDistance${this.index}`).val() as string);
    }
    public set distance(v: number) {
        this.logger.debug(`Setting distance to ${v}`);
        $(`#partDistance${this.index}`).val(v);
    }
}
