import { Random, MersenneTwister19937 } from 'random-js';
import { ParserFactory, DiceRollResult, DiceParser, FaceParser, Symbols } from './';

export class RollService {
    private diceParser: DiceParser;
    private faceParser: FaceParser;
    constructor(parserFactory: ParserFactory) {
        this.diceParser = parserFactory.createDiceParser();
        this.faceParser = parserFactory.createFaceParser();
    }
    public roll(dicesToRoll: string): RollServiceResult {
        const result = new Array<DiceRollResult>();
        var dices = this.diceParser.parse(dicesToRoll);
        var random = this.createRandom();
        dices.forEach(dice => {
            const face = random.pick(dice.faces);
            result.push({ dice, resultingFace: face });
        });
        return new RollServiceResult(result, this.faceParser);
    }
    private createRandom(): Random {
        const engine = MersenneTwister19937.autoSeed();
        const random = new Random(engine);
        return random;
    }
}

export class RollServiceResult {
    constructor(public dices: Array<DiceRollResult>, private faceParser: FaceParser) {}

    public countSymbols(): SymbolsCount {
        var symbols = this.faceParser.parse(this.dices);
        return {
            success: symbols.filter(x => x == Symbols.Success).length,
            advantage: symbols.filter(x => x == Symbols.Advantage).length,
            triumph: symbols.filter(x => x == Symbols.Triumph).length,
            failure: symbols.filter(x => x == Symbols.Failure).length,
            threat: symbols.filter(x => x == Symbols.Threat).length,
            despair: symbols.filter(x => x == Symbols.Despair).length,
            lightSide: symbols.filter(x => x == Symbols.LightSide).length,
            darkSide: symbols.filter(x => x == Symbols.DarkSide).length
        };
    }

    public reduceRoll(): SymbolsCount {
        const symbolsCount = this.countSymbols();
        var result = {
            success: symbolsCount.success + symbolsCount.triumph - symbolsCount.failure - symbolsCount.despair,
            advantage: symbolsCount.advantage - symbolsCount.threat,
            triumph: symbolsCount.triumph,
            failure: 0,
            threat: 0,
            despair: symbolsCount.despair,
            lightSide: symbolsCount.lightSide,
            darkSide: symbolsCount.darkSide
        };
        if (result.success < 0) {
            result.failure = Math.abs(result.success);
            result.success = 0;
        }
        if (result.advantage < 0) {
            result.threat = Math.abs(result.advantage);
            result.advantage = 0;
        }
        return result;
    }

    public flattenFaces(spacer: string = ''): string {
        const resultingFaces = this.dices.map(x => x.resultingFace).reduce((previous, current) => previous + spacer + current);
        return resultingFaces;
    }
}

export interface SymbolsCount {
    success: number;
    advantage: number;
    triumph: number;
    failure: number;
    threat: number;
    despair: number;
    lightSide: number;
    darkSide: number;
    speed?: number;
}
