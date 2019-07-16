import { Logger } from '../Logging';
import { DiscordInfo } from './DiscordInfo';
export class DiscordAccessor implements DiscordInfo {
    constructor(private logger: Logger<DiscordAccessor>) {}
    public get userId(): string {
        return $('#discordUserId').val() as string;
    }
    public set userId(v: string) {
        this.logger.debug(`Setting userId to ${v}`);
        $('#discordUserId').val(v);
    }
    public get channelId(): string {
        return $('#discordChannelId').val() as string;
    }
    public set channelId(v: string) {
        this.logger.debug(`Setting channelId to ${v}`);
        $('#discordChannelId').val(v);
    }
    public get guildId(): string {
        return $('#discordGuildId').val() as string;
    }
    public set guildId(v: string) {
        this.logger.debug(`Setting discordGuildId to ${v}`);
        $('#discordGuildId').val(v);
    }
}
