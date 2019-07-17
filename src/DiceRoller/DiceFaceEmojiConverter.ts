import { DiscordInfo } from '../DiscordInfo';
import { MyDiscordBot } from '../MyDiscordBot';
import { Symbols, DiceRollResult } from './';

export class DiceFaceEmojiConverter {
    private bot: MyDiscordBot;
    constructor(discordInfo: DiscordInfo) {
        this.bot = new MyDiscordBot(discordInfo);
    }
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
    public convertSymbolToEmoji(symbols: Symbols): string {
        var name = this.convertSymbolToName(symbols);
        return this.bot.findEmojiString(name);
    }
    public convertRollToEmoji(diceRollResult: DiceRollResult): string {
        var name = this.convertRollToName(diceRollResult);
        return this.bot.findEmojiString(name);
    }
}
