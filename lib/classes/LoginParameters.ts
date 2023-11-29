import { Utils } from './Utils';

export class LoginParameters
{
    firstName: string;
    lastName: string;
    password: string;
    start = 'last';
    url = 'https://login.agni.lindenlab.com/cgi-bin/login.cgi';
    token?: string;
    mfa_hash?: string;
    agreeToTOS?: true;
    readCritical?: true;

    passwordPrehashed = false;

    getHashedPassword(): string
    {
        if (this.passwordPrehashed)
        {
            return this.password;
        }
        return '$1$' + Utils.MD5String(this.password.substring(0, 16));
    }
}
