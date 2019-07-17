import { BatchCommand } from './BatchCommand';
import { Client, TextChannel } from 'discord.js';
import { DiscordInfo } from './DiscordInfo';
import { TableRenderer } from './TableRenderer';
import { config } from './config';
import { RaceModel } from './RacerCommand';

export class MyDiscordBot {
    private client!: Client;
    constructor(private discordInfo: DiscordInfo) {}
    public async sendBatchCommands(command: BatchCommand): Promise<number> {
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
    public findEmojiString(name: string): string {
        const guild = this.client.guilds.get(this.discordInfo.guildId);
        const emoji = guild.emojis.find(x => x.name == name);
        const result = emoji.toString();
        return result;
    }
    private enforceClient(): Promise<string> {
        if (this.client) return Promise.resolve('');
        this.client = new Client();
        return this.client.login(config.auth.token);
    }
}
