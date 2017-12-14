import { UUID } from './UUID';
import { Agent } from './Agent';
import { Region } from './Region';
import { LoginFlags } from '../enums/LoginFlags';
import { ClientEvents } from './ClientEvents';
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
    private static toRegionHandle(x_global, y_global);
    private static parseVector3(str);
    private static parseHome(str);
    constructor(json: any, ce: ClientEvents);
}
