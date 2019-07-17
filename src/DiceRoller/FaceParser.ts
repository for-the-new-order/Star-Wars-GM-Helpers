import { Symbols, DiceRollResult } from './';

export class FaceParser {
    constructor(
        private faceMapper: {
            [key: string]: Symbols;
        }
    ) {}
    public parse(rollResult: Array<DiceRollResult>): Array<Symbols> {
        const symbols = new Array<Symbols>();
        for (let rollIndex = 0; rollIndex < rollResult.length; rollIndex++) {
            const rolledDice = rollResult[rollIndex];
            for (let charIndex = 0; charIndex < rolledDice.resultingFace.length; charIndex++) {
                const char = rolledDice.resultingFace.charAt(charIndex);
                var current = this.faceMapper[char];
                symbols.push(current);
            }
        }
        return symbols;
    }
}
