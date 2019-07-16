"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var discord_js_1 = require("discord.js");
var TableRenderer_1 = require("./TableRenderer");
var exphbs = require("express-handlebars");
var config = require('./config').configuration;
var discordOptions = config.discord;
var app = express();
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');
app.use(express.urlencoded());
app.use(express.static('assets'));
app.use('/bootstrap-dark', express.static('node_modules\\@forevolve\\bootstrap-dark\\dist\\css'));
app.use('/font-awesome', express.static('node_modules\\@fortawesome\\fontawesome-free'));
var listener = app.listen(8889, function () {
    console.log('Listening on port ' + listener.address().port);
});
//
// Pages
app.get('/', function (req, res) {
    res.render('home', {});
});
app.get('/race', function (req, res) {
    res.render('race', {
        model: {
            commandIdentifier: 'RacerCommand',
            laps: [new RacePart('Part 1'), new RacePart('Part 2'), new RacePart('Part 3'), new RacePart('Part 4'), new RacePart('Part 5')],
            racers: [defaultRacer()],
            discordOptions: discordOptions
        }
    });
});
app.get('/batchCommands', function (req, res) {
    res.render('batchCommands', {
        model: {
            commandIdentifier: 'BatchCommand'
        }
    });
});
//
// Query/Ajax/partial rendering
app.get('/partials/index-display-symbols-form', function (req, res) {
    var racer = defaultRacer();
    var model = Object.assign({ layout: false, index: req.query.index }, racer);
    res.render('partials/racePilotRow', model);
});
//
// Commands
app.post('/commands/batch', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var command, discordOptions, bot, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = req.body;
                    discordOptions = req.body;
                    bot = new MyDiscordBot(discordOptions);
                    return [4 /*yield*/, bot.sendBatchCommands(command)];
                case 1:
                    result = _a.sent();
                    res.send(result + " messages sent");
                    return [2 /*return*/];
            }
        });
    });
});
app.post('/commands/display-symbols', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var command, discordOptions, bot, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = req.body;
                    discordOptions = req.body;
                    bot = new MyDiscordBot(discordOptions);
                    return [4 /*yield*/, bot.sendDisplaySymbolsCommands(command)];
                case 1:
                    result = _a.sent();
                    res.send(result + " symbols sent.");
                    return [2 /*return*/];
            }
        });
    });
});
function defaultRacer() {
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
        lap: 0,
        successes: 0,
        advantages: 0,
        triumphs: 0,
        failures: 0,
        threats: 0,
        despairs: 0
    };
}
var RacePart = /** @class */ (function () {
    function RacePart(name, difficulty, distance) {
        if (difficulty === void 0) { difficulty = 'pp'; }
        if (distance === void 0) { distance = 20; }
        this.name = name;
        this.difficulty = difficulty;
        this.distance = distance;
    }
    return RacePart;
}());
var MyDiscordBot = /** @class */ (function () {
    function MyDiscordBot(discordOptions) {
        this.discordOptions = discordOptions;
    }
    MyDiscordBot.prototype.sendBatchCommands = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.enforceClient()];
                    case 1:
                        _a.sent();
                        channel = this.client.channels.get(this.discordOptions.channelId);
                        command.chatCommands.forEach(function (message) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                channel.send(message);
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/, command.chatCommands.length];
                }
            });
        });
    };
    MyDiscordBot.prototype.sendDisplaySymbolsCommands = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!command.symbols) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.enforceClient()];
                    case 1:
                        _a.sent();
                        channel = this.client.channels.get(this.discordOptions.channelId);
                        message = this.makeMessage(command);
                        channel.send(message);
                        return [2 /*return*/, command.symbols.length];
                    case 2: return [2 /*return*/, 0];
                }
            });
        });
    };
    MyDiscordBot.prototype.makeMessage = function (command) {
        var table = new TableRenderer_1.TableRenderer();
        table.setHeader(['Racer', 'Type', 'Successes', 'Advantages', 'Triumphs', 'Failures', 'Threats', 'Despairs']);
        if (command.symbols) {
            command.symbols.forEach(function (row) {
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
    };
    // private emojiFinder(name: string): (value: Emoji, key: string, collection: Collection<string, Emoji>) => boolean {
    //     return x => x.name == name;
    // }
    MyDiscordBot.prototype.enforceClient = function () {
        if (this.client)
            return Promise.resolve('');
        this.client = new discord_js_1.Client();
        return this.client.login(config.auth.token);
    };
    return MyDiscordBot;
}());
//# sourceMappingURL=index.js.map