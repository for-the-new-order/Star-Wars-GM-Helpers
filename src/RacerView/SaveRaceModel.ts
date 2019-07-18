import { RaceModel } from '.';
import { DiscordInfo } from '../DiscordInfo';
export interface SaveRaceModel {
    name: string;
    race: RaceModel;
    discordInfo: DiscordInfo;
}
