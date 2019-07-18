import { Logger, LoggerFactory } from '../Logging';
import { RacerModel } from '.';

export class RacerRowAccessor implements RacerModel {
    protected logger: Logger<RacerRowAccessor>;
    constructor(private index: number, loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(RacerRowAccessor);
    }

    public getIndex(): number {
        return this.index;
    }

    //
    // Racer
    //
    public get racer(): string {
        return $(`#racer-${this.index}`).val() as string;
    }
    public set racer(v: string) {
        this.logger.debug(`Setting racer to ${v}`);
        $(`#racer-${this.index}`).val(v);
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
    // Vehicle
    //

    public get vehicle(): string {
        return $(`#vehicle-${this.index}`).val() as string;
    }
    public set vehicle(v: string) {
        this.logger.debug(`Setting vehicle to ${v}`);
        $(`#vehicle-${this.index}`).val(v);
    }

    public get silhouette(): number {
        return parseInt($(`#silhouette-${this.index}`).val() as string);
    }
    public set silhouette(v: number) {
        this.logger.debug(`Setting silhouette to ${v}`);
        $(`#silhouette-${this.index}`).val(v);
    }

    public get currentSpeed(): number {
        return parseInt($(`#current-speed-${this.index}`).val() as string);
    }
    public set currentSpeed(v: number) {
        this.logger.debug(`Setting currentSpeed to ${v}`);
        $(`#current-speed-${this.index}`).val(v);
    }

    public get maxSpeed(): number {
        return parseInt($(`#max-speed-${this.index}`).val() as string);
    }
    public set maxSpeed(v: number) {
        this.logger.debug(`Setting maxSpeed to ${v}`);
        $(`#max-speed-${this.index}`).val(v);
    }

    public get handling(): number {
        return parseInt($(`#handling-${this.index}`).val() as string);
    }
    public set handling(v: number) {
        this.logger.debug(`Setting handling to ${v}`);
        $(`#handling-${this.index}`).val(v);
    }

    public get currentSystemStrain(): number {
        return parseInt($(`#current-ss-${this.index}`).val() as string);
    }
    public set currentSystemStrain(v: number) {
        this.logger.debug(`Setting currentSystemStrain to ${v}`);
        $(`#current-ss-${this.index}`).val(v);
    }

    public get maxSystemStrain(): number {
        return parseInt($(`#max-ss-${this.index}`).val() as string);
    }
    public set maxSystemStrain(v: number) {
        this.logger.debug(`Setting maxSystemStrain to ${v}`);
        $(`#max-ss-${this.index}`).val(v);
    }

    public get currentHull(): number {
        return parseInt($(`#current-hull-${this.index}`).val() as string);
    }
    public set currentHull(v: number) {
        this.logger.debug(`Setting currentHull to ${v}`);
        $(`#current-hull-${this.index}`).val(v);
    }

    public get maxHull(): number {
        return parseInt($(`#max-hull-${this.index}`).val() as string);
    }
    public set maxHull(v: number) {
        this.logger.debug(`Setting maxHull to ${v}`);
        $(`#max-hull-${this.index}`).val(v);
    }

    public get part(): number {
        return parseInt($(`#part-${this.index}`).val() as string);
    }
    public set part(v: number) {
        this.logger.debug(`Setting part to ${v}`);
        $(`#part-${this.index}`).val(v);
    }

    public get lap(): number {
        return parseInt($(`#lap-${this.index}`).val() as string);
    }
    public set lap(v: number) {
        this.logger.debug(`Setting lap to ${v}`);
        $(`#lap-${this.index}`).val(v);
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

    public get threats(): number {
        return parseInt($(`#threats-${this.index}`).val() as string);
    }
    public set threats(v: number) {
        this.logger.debug(`Setting threats to ${v}`);
        $(`#threats-${this.index}`).val(v);
    }

    public get failures(): number {
        return parseInt($(`#failures-${this.index}`).val() as string);
    }
    public set failures(v: number) {
        this.logger.debug(`Setting failures to ${v}`);
        $(`#failures-${this.index}`).val(v);
    }

    public get despairs(): number {
        return parseInt($(`#despairs-${this.index}`).val() as string);
    }
    public set despairs(v: number) {
        this.logger.debug(`Setting despairs to ${v}`);
        $(`#despairs-${this.index}`).val(v);
    }
}
