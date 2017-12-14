import { LoginParameters } from './classes/LoginParameters';
import { LoginResponse } from './classes/LoginResponse';
import { ClientEvents } from './classes/ClientEvents';
import { BotOptionFlags } from './enums/BotOptionFlags';
export declare class LoginHandler {
    private clientEvents;
    private options;
    static GenerateMAC(): string;
    constructor(ce: ClientEvents, options: BotOptionFlags);
    Login(params: LoginParameters): Promise<LoginResponse>;
}
