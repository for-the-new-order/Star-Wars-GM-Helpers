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
        return $(`#silhouette-${this.index}`).val() as number;
    }
    public set silhouette(v: number) {
        this.logger.debug(`Setting silhouette to ${v}`);
        $(`#silhouette-${this.index}`).val(v);
    }

    public get currentSpeed(): number {
        return $(`#current-speed-${this.index}`).val() as number;
    }
    public set currentSpeed(v: number) {
        this.logger.debug(`Setting currentSpeed to ${v}`);
        $(`#current-speed-${this.index}`).val(v);
    }

    public get maxSpeed(): number {
        return $(`#max-speed-${this.index}`).val() as number;
    }
    public set maxSpeed(v: number) {
        this.logger.debug(`Setting maxSpeed to ${v}`);
        $(`#max-speed-${this.index}`).val(v);
    }

    public get handling(): number {
        return $(`#handling-${this.index}`).val() as number;
    }
    public set handling(v: number) {
        this.logger.debug(`Setting handling to ${v}`);
        $(`#handling-${this.index}`).val(v);
    }

    public get currentSystemStrain(): number {
        return $(`#current-ss-${this.index}`).val() as number;
    }
    public set currentSystemStrain(v: number) {
        this.logger.debug(`Setting currentSystemStrain to ${v}`);
        $(`#current-ss-${this.index}`).val(v);
    }

    public get maxSystemStrain(): number {
        return $(`#max-ss-${this.index}`).val() as number;
    }
    public set maxSystemStrain(v: number) {
        this.logger.debug(`Setting maxSystemStrain to ${v}`);
        $(`#max-ss-${this.index}`).val(v);
    }

    public get currentHull(): number {
        return $(`#current-hull-${this.index}`).val() as number;
    }
    public set currentHull(v: number) {
        this.logger.debug(`Setting currentHull to ${v}`);
        $(`#current-hull-${this.index}`).val(v);
    }

    public get maxHull(): number {
        return $(`#max-hull-${this.index}`).val() as number;
    }
    public set maxHull(v: number) {
        this.logger.debug(`Setting maxHull to ${v}`);
        $(`#max-hull-${this.index}`).val(v);
    }

    public get part(): number {
        return $(`#part-${this.index}`).val() as number;
    }
    public set part(v: number) {
        this.logger.debug(`Setting part to ${v}`);
        $(`#part-${this.index}`).val(v);
    }

    public get lap(): number {
        return $(`#lap-${this.index}`).val() as number;
    }
    public set lap(v: number) {
        this.logger.debug(`Setting lap to ${v}`);
        $(`#lap-${this.index}`).val(v);
    }

    //
    // Symbols
    //
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
