import { Command } from '../BaseCommand';
import { RacerModel } from '.';
export interface RaceModel extends Command {
    racers: RacerModel[];
}
