export interface BaseCommands {
    userId: string;
    channelId: string;
    guildId: string;
    initialize(): void;
}
