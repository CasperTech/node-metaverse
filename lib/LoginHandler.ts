import * as xmlrpc from 'xmlrpc';
import * as uuid from 'uuid';
import * as url from 'url';
import { LoginParameters } from './classes/LoginParameters';
import { LoginResponse } from './classes/LoginResponse';
import { ClientEvents } from './classes/ClientEvents';
import { BotOptionFlags } from './enums/BotOptionFlags';

export class LoginHandler
{
    private clientEvents: ClientEvents;
    private options: BotOptionFlags;

    static GenerateMAC(): string
    {
        const hexDigits = '0123456789ABCDEF';
        let macAddress = '';
        for (let i = 0; i < 6; i++)
        {
            macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
            macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
            if (i !== 5)
            {
                macAddress += ':';
            }
        }

        return macAddress;
    }

    constructor(ce: ClientEvents, options: BotOptionFlags)
    {
        this.clientEvents = ce;
        this.options = options;
    }

    Login(params: LoginParameters): Promise<LoginResponse>
    {
        return new Promise<LoginResponse>((resolve, reject) =>
        {
            const loginURI = url.parse(params.url);

            let secure = false;

            if (loginURI.protocol !== null && loginURI.protocol.trim().toLowerCase() === 'https:')
            {
                secure = true;
            }

            let port: string | null = loginURI.port;
            if (port === null)
            {
                port = secure ? '443' : '80';
            }

            const secureClientOptions = {
                host: loginURI.hostname || undefined,
                port: parseInt(port, 10),
                path: loginURI.path || undefined,
                rejectUnauthorized: false,
                timeout: 60000
            };
            const client = (secure) ? xmlrpc.createSecureClient(secureClientOptions) : xmlrpc.createClient(secureClientOptions);
            client.methodCall('login_to_simulator',
                [
                    {
                        'first': params.firstName,
                        'last': params.lastName,
                        'passwd': params.getHashedPassword(),
                        'start': params.start,
                        'major': '0',
                        'minor': '0',
                        'patch': '1',
                        'build': '0',
                        'platform': 'win',
                        'mac': LoginHandler.GenerateMAC(),
                        'viewer_digest': uuid.v4(),
                        'user_agent': 'node-metaverse',
                        'author': 'nmv@caspertech.co.uk',
                        'options': [
                            'inventory-root',
                            'inventory-skeleton',
                            'inventory-lib-root',
                            'inventory-lib-owner',
                            'inventory-skel-lib',
                            'gestures',
                            'event_categories',
                            'event_notifications',
                            'classified_categories',
                            'buddy-list',
                            'ui-config',
                            'login-flags',
                            'global-textures'
                        ]
                    }
                ], (error: Object, value: any) =>
                {
                    if (error)
                    {
                        reject(error);
                    }
                    else
                    {
                        if (!value['login'] || value['login'] === 'false')
                        {
                            reject(new Error(value['message']));
                        }
                        else
                        {
                            const response = new LoginResponse(value, this.clientEvents, this.options);
                            resolve(response);
                        }
                    }
                }
            );
        });
    }

}
