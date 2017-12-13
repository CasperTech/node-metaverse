import { LoginParameters } from './classes/LoginParameters';
import { LoginResponse } from './classes/LoginResponse';
export declare class LoginHandler {
    static GenerateMAC(): string;
    Login(params: LoginParameters): Promise<LoginResponse>;
}
