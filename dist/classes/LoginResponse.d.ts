import { UUID } from './UUID';
import { Agent } from './Agent';
import { Region } from './Region';
import { ClientEvents } from './ClientEvents';
import { BotOptionFlags, LoginFlags } from '..';
export declare class LoginResponse {
    loginFlags: LoginFlags;
    loginMessage: string;
    agent: Agent;
    region: Region;
    events: {
        categories: {
            categoryID: number;
            categoryName: string;
        }[];
    };
    classifieds: {
        categories: {
            categoryID: number;
            categoryName: string;
        }[];
    };
    textures: {
        'cloudTextureID'?: UUID;
        'sunTextureID'?: UUID;
        'moonTextureID'?: UUID;
    };
    searchToken: string;
    clientEvents: ClientEvents;
    private static toRegionHandle;
    private static parseVector3;
    private static parseHome;
    constructor(json: any, clientEvents: ClientEvents, options: BotOptionFlags);
}
