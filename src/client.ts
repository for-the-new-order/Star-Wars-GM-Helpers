import { Logger, LoggerFactory } from './Logging';
import { Command } from './BaseCommand';
import { DiscordAccessor } from './DiscordInfo';
import { BatchCommand } from './BatchCommand';
import { RacerFormFactory, RacerCommand, RacePartFactory } from './RacerCommand';

export class Main {
    private logger: Logger<Main>;
    constructor(private commands: Command[], loggerFactory: LoggerFactory) {
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
const loggerFactory = new LoggerFactory();
const discordInfo = new DiscordAccessor(loggerFactory.create(DiscordAccessor));
const formAccessor = new BatchCommand(loggerFactory, discordInfo);
const racerFormFactory = new RacerFormFactory(loggerFactory);
const racePartFactory = new RacePartFactory(loggerFactory);
const displaySymbolsCommandsFormAccessor = new RacerCommand(loggerFactory, racerFormFactory, discordInfo, racePartFactory);
const commands = [formAccessor, displaySymbolsCommandsFormAccessor];
const main = new Main(commands, loggerFactory);

$(() => {
    main.initialize();
});
