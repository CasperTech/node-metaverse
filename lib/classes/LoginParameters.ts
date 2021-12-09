import * as crypto from 'crypto';

export class LoginParameters
{
    firstName: string;
    lastName: string;
    password: string;
    start = 'last';
    url = 'https://login.agni.lindenlab.com/cgi-bin/login.cgi';

    passwordPrehashed = false;

    getHashedPassword() : string {
        if(this.passwordPrehashed){
            return this.password;
        }
        return '$1$' + crypto.createHash('md5').update(this.password.substr(0, 16)).digest('hex');
    }
}
