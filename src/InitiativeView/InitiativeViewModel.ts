import { DiscordInfo } from '../DiscordInfo';

export interface InitiativeViewModel {
    model: {
        commandIdentifier: 'InitiativeView';
        characters: Array<InitiativeCharacterViewModel>;
        discordInfo: DiscordInfo;
        currentIndex: 0;
        currentRound: 0;
    };
}

export interface InitiativeCharacterViewModel {
    name: string;
    skill: string;
    type: string;
    successes: number;
    advantages: number;
    triumphs: number;
}
