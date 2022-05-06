import { Logger } from '../../lib/classes/Logger';
import { LoginError } from '../../lib/classes/LoginError';
import { ExampleBot } from '../ExampleBot';
import * as readline from 'readline';
import * as fs from 'fs';

class MFA extends ExampleBot
{
    public async login(): Promise<void>
    {
        try
        {
            await super.login();
        }
        catch (e: unknown)
        {
            if (e instanceof LoginError)
            {
                if (e.reason === 'mfa_challenge')
                {
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    rl.question('Please enter authenticator code for ' + String(this.firstName) + ' ' + String(this.lastName) + '\n# ', (code) =>
                    {
                        this.bot.loginParameters.token = code;
                        void this.login();
                    });
                    return;
                }
            }
            Logger.Error(e);
        }
    }

    public async onConnected(): Promise<void>
    {
        if (this.loginResponse && this.loginResponse.mfaHash)
        {
            // Store MFA hash in our login credentials for next time
            this.loginParameters.mfa_hash = this.loginResponse.mfaHash;
            delete this.loginParameters.token;
            await fs.promises.writeFile(this.loginParamsJsonFile, JSON.stringify(this.loginParameters, null, 4));
        }
    }
}

new MFA().run().then(() =>
{

}).catch((err) =>
{
    console.error(err);
});
