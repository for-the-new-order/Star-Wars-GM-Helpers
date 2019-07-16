import { RacePartModel } from './RacePartModel';
export class RacePart implements RacePartModel {
    constructor(public name: string, public difficulty: string = 'pp', public distance: number = 20) {}
}
