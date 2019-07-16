import { BatchCommand } from './BatchCommand';
import * as express from 'express';
import { AddressInfo } from 'net';
import { Client, Message, TextChannel, Emoji, Collection } from 'discord.js';
import { DiscordInfo } from './DiscordInfo';
import { TableRenderer } from './TableRenderer';
import * as exphbs from 'express-handlebars';
import { config } from './config';
import { RacePart, RaceModel, RacerModel } from './RacerCommand';

const discordInfo = config.discord as DiscordInfo;
const app = express();
app.engine(
    'hbs',
    exphbs({
        extname: 'hbs',
        defaultLayout: 'default',
        layoutsDir: __dirname + '/../views/layouts/',
        partialsDir: __dirname + '/../views/partials/'
    })
);
app.set('view engine', 'hbs');
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/bootstrap-dark', express.static('node_modules\\@forevolve\\bootstrap-dark\\dist\\css'));
app.use('/font-awesome', express.static('node_modules\\@fortawesome\\fontawesome-free'));

const listener = app.listen(8889, function() {
    console.log('Listening on port ' + (listener.address() as AddressInfo).port);
});

//
// Pages
app.get('/', function(req, res) {
    res.render('home', {});
});
app.get('/race', function(req, res) {
    res.render('race', {
        model: {
            commandIdentifier: 'RacerCommand',
            laps: [new RacePart('Part 1'), new RacePart('Part 2'), new RacePart('Part 3'), new RacePart('Part 4'), new RacePart('Part 5')],
            racers: [defaultRacer()],
            discordInfo
        }
    });
});
app.get('/batchCommands', function(req, res) {
    res.render('batchCommands', {
        model: {
            commandIdentifier: 'BatchCommand'
        }
    });
});

//
// Query/Ajax/partial rendering
app.get('/partials/index-display-symbols-form', function(req, res) {
    var racer = defaultRacer();
    var model = Object.assign({ layout: false, index: req.query.index }, racer);
    res.render('partials/racePilotRow', model);
});

//
// Commands
app.post('/commands/batch', async function(req, res) {
    const command = req.body as BatchCommand;
    const discordInfo = req.body as DiscordInfo;
    const bot = new MyDiscordBot(discordInfo);
    var result = await bot.sendBatchCommands(command);
    res.send(`${result} messages sent`);
});
app.post('/commands/display-racers', async function(req, res) {
    const command = req.body as RaceModel;
    const discordInfo = req.body as DiscordInfo;
    const bot = new MyDiscordBot(discordInfo);
    var result = await bot.sendDisplaySymbolsCommands(command);
    res.send(`${result} symbols sent.`);
});

function defaultRacer(): RacerModel {
    return {
        racer: '',
        skill: '',
        type: 'NPC',
        vehicle: '',
        silhouette: 0,
        currentSpeed: 0,
        maxSpeed: 0,
        handling: 0,
        currentSystemStrain: 0,
        maxSystemStrain: 0,
        currentHull: 0,
        maxHull: 0,
        part: 0,
        lap: 0,
        successes: 0,
        advantages: 0,
        triumphs: 0,
        failures: 0,
        threats: 0,
        despairs: 0
    };
}

class MyDiscordBot {
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

    public async sendDisplaySymbolsCommands(command: RaceModel): Promise<number> {
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
        table.setHeader(['Racer', 'Type', 'Successes', 'Advantages', 'Triumphs', 'Failures', 'Threats', 'Despairs']);
        if (command.racers) {
            command.racers.forEach(row => {
                table.addRow([
                    row.racer,
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
