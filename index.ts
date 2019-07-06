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
    // const chatCommand = req.body.chatCommand;
    // let output = '';
    // const messageMock = MakeMessage(chatCommand, chat => (output += chat));
    // await chatCommandManager.Handle(messageMock.object);
    // output = cleanMarkdownCodeBreak(output, OutputType.JSON);
    // output = cleanMarkdownCodeBreak(output, OutputType.YAML);
    // res.send(output);

    //
    // TODO: send message through bot
    //
    //bot.channels.find('id', discordOptions.channelId).client.user.
    //bot.user.send(discordOptions);
    var result = await bot.send(command);
    res.send(`${result.length} messages sent`);
});

class MyDiscordBot {
    private client!: Client;
    public send(command: BatchCommands): Promise<Message[]> {
        return this.enforceClient().then(() => {
            const channel = this.client.channels.get(command.channelId) as TextChannel;
            const commands = command.chatCommands.replace('\r', '').split('\n');
            const results = new Array<Message>();
            commands.forEach(async message => {
                const result = await channel.send(message);
                if (Array.isArray(result)) {
                    (result as Message[]).forEach(r => {
                        results.push(r);
                    });
                } else {
                    results.push(result as Message);
                }
            });
            return results;
        });
    }

    private enforceClient(): Promise<string> {
        if (this.client) return Promise.resolve('');
        this.client = new Client();
        return this.client.login(config.auth.token);
    }
}
