import { Command, BaseCommand } from '../BaseCommand';
import { LoggerFactory } from '../Logging';
import { DiscordInfo } from '../DiscordInfo';

export class BatchCommand extends BaseCommand<BatchCommand> implements Command {
    private chatCommandsSelector = '#chatCommands';

    constructor(loggerFactory: LoggerFactory, private discordInfo: DiscordInfo) {
        super(loggerFactory.create(BatchCommand));
    }
    public initialize(): void {
        this.logger.trace('BatchCommand loading');
        const me = this;
        $('#submitMessages').on('click', function(e) {
            me.logger.trace('BatchCommand:clicked');
            e.preventDefault();
            $.ajax({
                url: '/commands/batch',
                method: 'POST',
                data: {
                    userId: me.discordInfo.userId,
                    channelId: me.discordInfo.channelId,
                    guildId: me.discordInfo.guildId,
                    chatCommands: me.chatCommands
                }
            }).done(function(msg) {
                me.logger.trace('BatchCommand:posted');
                me.logger.info(msg);
            });
        });
        this.logger.trace('BatchCommand loaded');
    }

    public get chatCommands(): string[] {
        const raw = $(this.chatCommandsSelector).val() as string;
        const commands = raw.replace('\r', '').split('\n');
        return commands;
    }
    public set chatCommands(v: string[]) {
        this.logger.debug(`Setting chatCommands to ${v}`);
        const commands = v.join('\n');
        $(this.chatCommandsSelector).val(commands);
    }
}
