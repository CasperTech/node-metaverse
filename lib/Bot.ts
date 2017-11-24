import {LoginHandler} from './LoginHandler';
import {LoginResponse} from './classes/LoginResponse';
import {LoginParameters} from './classes/LoginParameters';

export class Bot
{
    loginParams: LoginParameters;

    constructor(login: LoginParameters)
    {
        this.loginParams = login;
    }

    Login()
    {
        return new Promise((resolve, reject) =>
        {
            const loginHandler = new LoginHandler();
            loginHandler.Login(this.loginParams).then((response: LoginResponse) =>
            {
                resolve(response);
            }).catch((error: Error) =>
            {
                reject(error);
            });
        });
    }
}
