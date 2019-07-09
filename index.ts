import * as express from 'express';
import { AddressInfo } from 'net';
import * as path from 'path';
import { Client, Message, TextChannel, Emoji, Collection } from 'discord.js';
import { DiscordOptions } from './DiscordOptions';
import { BatchCommands } from './BatchCommands';
import { DisplaySymbolsCommands } from './DisplaySymbolsCommands';
import { TableRenderer } from './TableRenderer';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as exphbs from 'express-handlebars';

const config = require('./config').configuration;
// console.info('Initializing the bot');
// const bot = new Client();
// bot.login(config.auth.token);
// bot.on('ready', function(evt: any) {
//     console.info(`The bot is connected and logged in as: ${bot.user.username} (${bot.user.id})`);
// });

const app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/bootstrap-dark', express.static('node_modules\\@forevolve\\bootstrap-dark\\dist\\css'));

const listener = app.listen(8889, function() {
    console.log('Listening on port ' + (listener.address() as AddressInfo).port);
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/partials/index-display-symbols-form', function(req, res) {
    res.render('index-display-symbols-form', { layout: false, index: req.query.index });
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
    res.send(`${result} symbols sent.`);
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

    public async sendDisplaySymbolsCommands(command: DisplaySymbolsCommands): Promise<number> {
        if (command.symbols) {
            await this.enforceClient();
            const channel = this.client.channels.get(command.channelId) as TextChannel;
            const message = this.makeMessage(command);
            channel.send(message);
            return command.symbols.length;
        }
        return 0;
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
        table.setHeader(['Label', 'Type', 'Successes', 'Advantages', 'Triumphs', 'Failures', 'Threats', 'Despairs']);
        //table.setHeader(['Label', advantage, success, triumph, threat, failure, despair]);
        if (command.symbols) {
            command.symbols.forEach(row => {
                table.addRow([
                    row.label,
                    row.type,
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

    // private emojiFinder(name: string): (value: Emoji, key: string, collection: Collection<string, Emoji>) => boolean {
    //     return x => x.name == name;
    // }

    private enforceClient(): Promise<string> {
        if (this.client) return Promise.resolve('');
        this.client = new Client();
        return this.client.login(config.auth.token);
    }
}
