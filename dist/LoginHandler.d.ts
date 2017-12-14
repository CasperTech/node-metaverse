import { LoginParameters } from './classes/LoginParameters';
import { LoginResponse } from './classes/LoginResponse';
import { ClientEvents } from './classes/ClientEvents';
export declare class LoginHandler {
    private clientEvents;
    static GenerateMAC(): string;
    constructor(ce: ClientEvents);
    Login(params: LoginParameters): Promise<LoginResponse>;
}
