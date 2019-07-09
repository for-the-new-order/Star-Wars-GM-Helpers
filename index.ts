import * as express from 'express';
import { AddressInfo } from 'net';
import * as path from 'path';
import { Client, Message, TextChannel, Emoji, Collection } from 'discord.js';
import { DiscordOptions } from './DiscordOptions';
import { BatchCommands } from './BatchCommands';
import { DisplaySymbolsCommands } from './DisplaySymbolsCommands';
import { TableRenderer } from './TableRenderer';

const config = require('./config').configuration;
// console.info('Initializing the bot');
// const bot = new Client();
// bot.login(config.auth.token);
// bot.on('ready', function(evt: any) {
//     console.info(`The bot is connected and logged in as: ${bot.user.username} (${bot.user.id})`);
// });

const app = express();
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/bootstrap-dark', express.static('node_modules\\@forevolve\\bootstrap-dark\\dist\\css'));

const listener = app.listen(8889, function() {
    console.log('Listening on port ' + (listener.address() as AddressInfo).port);
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/commands/batch', async function(req, res) {
    const command = req.body as BatchCommands;
    const bot = new MyDiscordBot();
    var result = await bot.sendBatchCommands(command);
    res.send(`${result} messages sent`);
});

app.post('/commands/display-symbols', async function(req, res) {
    const command = req.body as DisplaySymbolsCommands;
    const bot = new MyDiscordBot();
    var result = await bot.sendDisplaySymbolsCommands(command);
    res.send(`Symbols sent: ${result}`);
});

class MyDiscordBot {
    private client!: Client;
    public async sendBatchCommands(command: BatchCommands): Promise<number> {
        await this.enforceClient();
        const channel = this.client.channels.get(command.channelId) as TextChannel;
        command.chatCommands.forEach(async message => {
            channel.send(message);
        });
        return command.chatCommands.length;
    }

    public async sendDisplaySymbolsCommands(command: DisplaySymbolsCommands): Promise<string> {
        await this.enforceClient();
        const channel = this.client.channels.get(command.channelId) as TextChannel;
        const message = this.makeMessage(command);
        channel.send(message);
        return JSON.stringify({
            label: command.label,
            symbols: command.symbols
        });
    }

    private makeMessage(command: DisplaySymbolsCommands): string {
        // const guild = this.client.guilds.get(command.guildId);
        // const advantage = guild.emojis.find(this.emojiFinder('advantage')).toString();
        // const success = guild.emojis.find(this.emojiFinder('success')).toString();
        // const triumph = guild.emojis.find(this.emojiFinder('triumph')).toString();
        // const threat = guild.emojis.find(this.emojiFinder('threat')).toString();
        // const failure = guild.emojis.find(this.emojiFinder('failure')).toString();
        // const despair = guild.emojis.find(this.emojiFinder('despair')).toString();
        var table = new TableRenderer();
        table.setHeader(['Label', 'Advantages', 'Successes', 'Triumphs', 'Threats', 'Failures', 'Despairs']);
        //table.setHeader(['Label', advantage, success, triumph, threat, failure, despair]);
        table.addRow([
            command.label,
            command.symbols.advantages.toString(),
            command.symbols.successes.toString(),
            command.symbols.triumphs.toString(),
            command.symbols.threats.toString(),
            command.symbols.failures.toString(),
            command.symbols.despairs.toString()
        ]);
        return table.build();
    }

    // private emojiFinder(name: string): (value: Emoji, key: string, collection: Collection<string, Emoji>) => boolean {
    //     return x => x.name == name;
    // }

    private enforceClient(): Promise<string> {
        if (this.client) return Promise.resolve('');
        this.client = new Client();
        return this.client.login(config.auth.token);
    }
}
