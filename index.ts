import * as express from 'express';
import { AddressInfo } from 'net';
import * as path from 'path';
import { Client, Message, TextChannel } from 'discord.js';
import { DiscordOptions } from './DiscordOptions';
import { BatchCommands } from './BatchCommands';

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

app.post('/command', async function(req, res) {
    const command = req.body as BatchCommands;
    const bot = new MyDiscordBot();
    var result = await bot.send(command);
    res.send(`${result} messages sent`);
});

class MyDiscordBot {
    private client!: Client;
    public async send(command: BatchCommands): Promise<number> {
        await this.enforceClient();
        const channel = this.client.channels.get(command.channelId) as TextChannel;
        command.chatCommands.forEach(async message => {
            channel.send(message);
        });
        return command.chatCommands.length;
    }

    private enforceClient(): Promise<string> {
        if (this.client) return Promise.resolve('');
        this.client = new Client();
        return this.client.login(config.auth.token);
    }
}
