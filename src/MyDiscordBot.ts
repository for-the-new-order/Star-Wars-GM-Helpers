import { Symbols } from './DiceRoller/Symbols';
import { BatchCommandsView } from './BatchCommandsView';
import { Client, TextChannel } from 'discord.js';
import { DiscordInfo } from './DiscordInfo';
import { TableRenderer } from './TableRenderer';
import { config } from './config';
import { RaceModel, RacerModel } from './RacerView';
import { SymbolsCount, RollServiceResult } from './DiceRoller/RollService';
import { DiceFaceEmojiConverter } from './DiceRoller';
import { LoggerFactory, Logger } from './Logging';

export class MyDiscordBot {
    private client!: Client;
    private logger: Logger<MyDiscordBot>;

    constructor(private discordInfo: DiscordInfo, loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(MyDiscordBot);
    }

    public async sendBatchCommands(command: BatchCommandsView): Promise<number> {
        await this.enforceClient();
        const channel = this.client.channels.get(this.discordInfo.channelId) as TextChannel;
        command.chatCommands.forEach(async message => {
            channel.send(message);
        });
        return command.chatCommands.length;
    }

    public async sendRaceResults(command: RaceModel): Promise<number> {
        if (command.racers) {
            await this.enforceClient();
            const channel = this.client.channels.get(this.discordInfo.channelId) as TextChannel;
            const message = this.makeMessage(command);
            channel.send(message);
            return command.racers.length;
        }
        return 0;
    }

    private makeMessage(command: RaceModel): string {
        var table = new TableRenderer();
        table.setHeader(['#', 'Racer', 'P/L', 'Successes', 'Advantages', 'Triumphs', 'Failures', 'Threats', 'Despairs']);
        if (command.racers) {
            command.racers.forEach((row, index) => {
                table.addRow([
                    (index + 1).toString(),
                    `${row.racer} (${row.type})`,
                    `${row.part}/${row.lap}`,
                    row.successes.toString(),
                    row.advantages.toString(),
                    row.triumphs.toString(),
                    row.failures.toString(),
                    row.threats.toString(),
                    row.despairs.toString()
                ]);
            });
        }
        return table.build();
    }

    public async sendChaseRollResult(model: RacerModel, rollResult: RollServiceResult) {
        await this.enforceClient();

        var finalResult = rollResult.reduceRoll();
        const converter = new DiceFaceEmojiConverter(this);
        let message = `[${model.type}]`;
        message += ` **${model.racer}**`;
        if (model.vehicle) {
            message += `, on board **${model.vehicle}**,`;
        }
        message += ' rolled ';
        message = await this.addDiceFaces(rollResult, converter, message);

        message += '(';
        message = await this.addComputedSymbols(finalResult, message, converter);
        message += ')';

        message += ' - ';
        message += finalResult.success > 0 ? 'SUCCESS' : 'FAILURE';

        this.logger.trace(`message: ${message}`);
        const channel = this.client.channels.get(this.discordInfo.channelId) as TextChannel;
        await channel.send(message);
    }

    public async sendRaceRollResult(model: RacerModel, rollResult: RollServiceResult) {
        await this.enforceClient();

        var finalResult = rollResult.reduceRoll();
        const converter = new DiceFaceEmojiConverter(this);
        let message = `[Part: ${model.part} | Lap: ${model.lap}] (${model.type})`;
        message += ` **${model.racer}**`;
        if (model.vehicle) {
            message += ` on board **${model.vehicle}**`;
        }
        message += ' rolled ';
        message = await this.addDiceFaces(rollResult, converter, message);

        message += '(';
        message = await this.addComputedSymbols(finalResult, message, converter);
        message += ')';
        this.logger.trace(`message: ${message}`);
        const channel = this.client.channels.get(this.discordInfo.channelId) as TextChannel;
        await channel.send(message);
    }

    public async sendInitRollResult(model: RacerModel, rollResult: RollServiceResult) {
        await this.enforceClient();

        var finalResult = rollResult.reduceRoll();
        const converter = new DiceFaceEmojiConverter(this);
        let message = `[${model.type}]`;
        message += ` **${model.racer}**`;
        // if (model.vehicle) {
        //     message += `, on board **${model.vehicle}**,`;
        // }
        message += ' rolled an init check of ';
        message = await this.addDiceFaces(rollResult, converter, message);

        message += '(';
        message = await this.addComputedSymbols(finalResult, message, converter);
        message += ')';

        this.logger.trace(`message: ${message}`);
        const channel = this.client.channels.get(this.discordInfo.channelId) as TextChannel;
        await channel.send(message);
    }

    private async addComputedSymbols(finalResult: SymbolsCount, message: string, converter: DiceFaceEmojiConverter) {
        if (finalResult.success > 0) {
            message += await converter.convertSymbolToEmoji(Symbols.Success);
            message += `${finalResult.success} `;
        }
        if (finalResult.advantage > 0) {
            message += await converter.convertSymbolToEmoji(Symbols.Advantage);
            message += `${finalResult.advantage} `;
        }
        if (finalResult.triumph > 0) {
            message += await converter.convertSymbolToEmoji(Symbols.Triumph);
            message += `${finalResult.triumph} `;
        }
        if (finalResult.failure > 0) {
            message += await converter.convertSymbolToEmoji(Symbols.Failure);
            message += `${finalResult.failure} `;
        }
        if (finalResult.threat > 0) {
            message += await converter.convertSymbolToEmoji(Symbols.Threat);
            message += `${finalResult.threat} `;
        }
        if (finalResult.despair > 0) {
            message += await converter.convertSymbolToEmoji(Symbols.Despair);
            message += `${finalResult.despair} `;
        }
        if (finalResult.lightSide > 0) {
            message += await converter.convertSymbolToEmoji(Symbols.LightSide);
            message += `${finalResult.lightSide} `;
        }
        if (finalResult.darkSide > 0) {
            message += await converter.convertSymbolToEmoji(Symbols.DarkSide);
            message += `${finalResult.darkSide} `;
        }
        return message;
    }

    private async addDiceFaces(rollResult: RollServiceResult, converter: DiceFaceEmojiConverter, message: string) {
        for (let i = 0; i < rollResult.dices.length; i++) {
            const dice = rollResult.dices[i];
            const diceIcon = await converter.convertRollToEmoji(dice);
            message += diceIcon;
        }
        return message;
    }

    public async findEmojiString(name: string): Promise<string> {
        await this.enforceClient();
        const guild = this.client.guilds.get(this.discordInfo.guildId);
        const emoji = guild.emojis.find(x => x.name == name);
        if (emoji) {
            this.logger.trace(`Emoji '${name}' found as ${emoji}`);
            return emoji.toString();
        }
        this.logger.trace(`Emoji '${name}' was not found.`);
    }

    private enforceClient(): Promise<string> {
        if (this.client) return Promise.resolve('');
        this.client = new Client();
        return this.client.login(config.auth.token);
    }
}
