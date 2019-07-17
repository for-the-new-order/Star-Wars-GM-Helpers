import { BatchCommand } from './BatchCommand';
import * as express from 'express';
import { AddressInfo } from 'net';
import { Message, Emoji, Collection } from 'discord.js';
import { DiscordInfo } from './DiscordInfo';
import * as exphbs from 'express-handlebars';
import { config } from './config';
import { RacePart, RaceModel, RacerModel, SaveRaceModel } from './RacerCommand';
import * as fs from 'fs';
import * as util from 'util';
import { MyDiscordBot } from './MyDiscordBot';
const readFile = util.promisify(fs.readFile);

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
app.get('/race', async function(req, res) {
    const commandIdentifier = {
        commandIdentifier: 'RacerCommand'
    };
    var raceModel = {
        parts: [new RacePart('Part 1'), new RacePart('Part 2'), new RacePart('Part 3'), new RacePart('Part 4'), new RacePart('Part 5')],
        racers: [defaultRacer()],
        discordInfo
    };
    var raceName = req.query.race;
    if (raceName) {
        const fileName = makeRaceFilePath(raceName);
        await readFile(fileName)
            .catch(reason => {
                console.error(reason);
            })
            .then(buf => {
                if (buf) {
                    var json = (buf as Buffer).toString();
                    raceModel = JSON.parse(json);
                }
            });
    }
    const viewModel = {
        model: Object.assign(commandIdentifier, raceModel)
    };
    res.render('race', viewModel);
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
    var result = await bot.sendRaceResults(command);
    res.send(`${result} symbols sent.`);
});
app.post('/commands/save-race', async function(req, res) {
    const raceToSave = req.body as SaveRaceModel;
    const dataModel = Object.assign({ discordInfo: raceToSave.discordInfo }, raceToSave.race);
    const data = JSON.stringify(dataModel, null, 4);
    const fileName = makeRaceFilePath(raceToSave.name);
    fs.writeFile(fileName, data, err => {
        if (err) {
            console.log(err);
        }
    });
    res.send(`Race ${raceToSave.name} saved.`);
});

function makeRaceFilePath(raceName: string): string {
    return `assets/races/${raceName}.json`;
}

function createDefaultRace(): RaceViewModel {
    return {
        commandIdentifier: 'RacerCommand',
        parts: [new RacePart('Part 1'), new RacePart('Part 2'), new RacePart('Part 3'), new RacePart('Part 4'), new RacePart('Part 5')],
        racers: [defaultRacer()],
        discordInfo
    };
}

export class RaceViewModel implements RaceModel {
    public parts: RacePart[] = new Array<RacePart>();
    public racers: RacerModel[] = new Array<RacerModel>();
    public commandIdentifier: string;
    public discordInfo: DiscordInfo;
}

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
