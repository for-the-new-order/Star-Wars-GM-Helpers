import { BaseView } from '../BaseView';
import { View } from '../View';
import { LoggerFactory } from '../Logging';
import { DiscordInfo } from '../DiscordInfo';

export class InitiativeView extends BaseView<InitiativeView> implements View {
    constructor(loggerFactory: LoggerFactory, private discordInfo: DiscordInfo) {
        super(loggerFactory.create(InitiativeView));
    }

    public initialize(): void {
        this.logger.trace('InitiativeView loading');
        this.logger.trace('InitiativeView loaded');
    }
}
