import { FaceParser, DiceParser } from './';

export interface ParserFactory {
    createDiceParser(): DiceParser;
    createFaceParser(): FaceParser;
}
