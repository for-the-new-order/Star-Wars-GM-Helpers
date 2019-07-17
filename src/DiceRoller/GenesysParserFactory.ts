import { ParserFactory, Symbols, DiceName, Dice, FaceParser, DiceParser } from './';

const dices = {
    Proficiency: {
        name: DiceName.Proficiency,
        color: 'yellow',
        faces: ['', 's', 's', 'ss', 'ss', 'a', 'sa', 'sa', 'sa', 'aa', 'aa', 'r']
    },
    Ability: {
        name: DiceName.Ability,
        color: 'green',
        faces: ['', 's', 's', 'ss', 'a', 'a', 'sa', 'aa']
    },
    Boost: {
        name: DiceName.Boost,
        color: 'blue',
        faces: ['', '', 's', 'sa', 'aa', 'a']
    },
    Challenge: {
        name: DiceName.Challenge,
        color: 'red',
        faces: ['', 'f', 'f', 'ff', 'ff', 't', 't', 'ft', 'ft', 'tt', 'tt', 'd']
    },
    Difficulty: {
        name: DiceName.Difficulty,
        color: 'purple',
        faces: ['', 'f', 'ff', 't', 't', 't', 'tt', 'ft']
    },
    Setback: {
        name: DiceName.Setback,
        color: 'black',
        faces: ['', '', 'f', 'f', 't', 't']
    },
    Force: {
        name: DiceName.Force,
        color: 'white',
        faces: ['n', 'n', 'n', 'n', 'n', 'n', 'nn', 'l', 'l', 'll', 'll', 'll']
    }
};

const diceMapper: { [key: string]: Dice } = {};
diceMapper['y'] = dices.Proficiency;
diceMapper['g'] = dices.Ability;
diceMapper['b'] = dices.Boost;
diceMapper['r'] = dices.Challenge;
diceMapper['p'] = dices.Difficulty;
diceMapper['k'] = dices.Setback;
diceMapper['w'] = dices.Force;

const faceMapper: { [key: string]: Symbols } = {};
faceMapper['s'] = Symbols.Success;
faceMapper['a'] = Symbols.Advantage;
faceMapper['r'] = Symbols.Triumph;
faceMapper['f'] = Symbols.Failure;
faceMapper['t'] = Symbols.Threat;
faceMapper['d'] = Symbols.Despair;
faceMapper['l'] = Symbols.LightSide;
faceMapper['n'] = Symbols.DarkSide;

export class GenesysParserFactory implements ParserFactory {
    public createDiceParser(): DiceParser {
        return new DiceParser(diceMapper);
    }
    public createFaceParser(): FaceParser {
        return new FaceParser(faceMapper);
    }
}
