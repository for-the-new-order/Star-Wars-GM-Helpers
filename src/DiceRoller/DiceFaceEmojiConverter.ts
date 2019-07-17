import { DiscordInfo } from '../DiscordInfo';
import { MyDiscordBot } from '../MyDiscordBot';
import { Symbols, DiceRollResult } from './';

export class DiceFaceEmojiConverter {
    constructor(private bot: MyDiscordBot) {}

    public convertSymbolToName(symbols: Symbols): string {
        if (symbols === Symbols.DarkSide) {
            return 'darkpip';
        }
        if (symbols === Symbols.LightSide) {
            return 'lightpip';
        }
        return symbols.toLowerCase();
    }
    public convertRollToName(diceRollResult: DiceRollResult): string {
        return `${diceRollResult.dice.color}${diceRollResult.resultingFace}`;
    }
    public async convertSymbolToEmoji(symbols: Symbols): Promise<string> {
        var name = this.convertSymbolToName(symbols);
        return await this.bot.findEmojiString(name);
    }
    public async convertRollToEmoji(diceRollResult: DiceRollResult): Promise<string> {
        var name = this.convertRollToName(diceRollResult);
        return await this.bot.findEmojiString(name);
    }
}
