import { Logger, LoggerFactory } from './Logging';
import { View } from './View';
import { DiscordAccessor } from './DiscordInfo';
import { BatchCommandsView } from './BatchCommandsView';
import { RacerFormFactory, RacerView, RacePartFactory } from './RacerView';
import { RollService, GenesysParserFactory } from './DiceRoller';
import { RaceService } from './RacerView/RacerView';
import { ClientSidePrependLogStrategy } from './Logging/Logger';
import { MyDiscordBot } from './MyDiscordBot';
import { InitiativeView } from './InitiativeView';

export class Main {
    private logger: Logger<Main>;
    constructor(private commands: View[], loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create(Main);
    }

    public initialize() {
        this.logger.trace('Main initializing');
        const currentCommand = $('body').attr('data-command-identifier');
        this.commands.forEach(command => {
            if (currentCommand === command.identifier) {
                this.logger.debug(`Current command: ${command.identifier}`);
                command.initialize();
            } else {
                this.logger.debug(`Skip initialization of command: ${command.identifier}`);
            }
        });
        this.logger.trace('Main initialized');
    }
}

//
// Composition root
//

const parserFactory = new GenesysParserFactory();
const rollService = new RollService(parserFactory);

const loggerFactory = new LoggerFactory(new ClientSidePrependLogStrategy());
const discordInfo = new DiscordAccessor(loggerFactory.create(DiscordAccessor));
const bot = new MyDiscordBot(discordInfo, loggerFactory);

// Batch commands View
const formAccessor = new BatchCommandsView(loggerFactory, discordInfo);

// Racer View
const racerFormFactory = new RacerFormFactory(loggerFactory);
const racePartFactory = new RacePartFactory(loggerFactory);
const raceService = new RaceService(rollService, loggerFactory);
const displaySymbolsCommandsFormAccessor = new RacerView(loggerFactory, racerFormFactory, discordInfo, racePartFactory, raceService, bot);

//InitiativeView
const initiativeView = new InitiativeView(loggerFactory, discordInfo);

// Main
const commands = [formAccessor, displaySymbolsCommandsFormAccessor, initiativeView];
const main = new Main(commands, loggerFactory);

$(() => {
    main.initialize();
});
