import { Utils } from './Utils';

export class LoginParameters
{
    public firstName: string;
    public lastName: string;
    public password: string;
    public start = 'last';
    public url = 'https://login.agni.lindenlab.com/cgi-bin/login.cgi';
    public token?: string;
    public mfa_hash?: string;
    public agreeToTOS?: true;
    public readCritical?: true;

    public passwordPrehashed = false;

    public getHashedPassword(): string
    {
        if (this.passwordPrehashed)
        {
            return this.password;
        }
        return '$1$' + Utils.MD5String(this.password.substring(0, 16));
    }
}
