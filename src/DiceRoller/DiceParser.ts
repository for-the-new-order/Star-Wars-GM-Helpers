import { Dice } from './';

export class DiceParser {
    constructor(
        private diceMapper: {
            [key: string]: Dice;
        }
    ) {}
    public parse(input: string): Array<Dice> {
        const dices = new Array<Dice>();
        for (let i = 0; i < input.length; i++) {
            const char = input.charAt(i);
            var current = this.diceMapper[char];
            dices.push(current);
        }
        return dices;
    }
}
