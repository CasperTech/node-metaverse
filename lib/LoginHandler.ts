import * as xmlrpc from 'xmlrpc';
import * as crypto from 'crypto';
import {LoginParameters} from './classes/LoginParameters';
import {LoginResponse} from './classes/LoginResponse';
import {ClientEvents} from './classes/ClientEvents';
import {BotOptionFlags} from './enums/BotOptionFlags';
const uuid = require('uuid');

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
            const secureClientOptions = {
                host: 'login.agni.lindenlab.com',
                port: 443,
                path: '/cgi-bin/login.cgi',
                rejectUnauthorized: false
            };
            const client = xmlrpc.createSecureClient(secureClientOptions);
            client.methodCall('login_to_simulator',
                [
                    {
                        'first': params.firstName,
                        'last': params.lastName,
                        'passwd': '$1$' + crypto.createHash('md5').update(params.password.substr(0, 16)).digest('hex'),
                        'start': 'home',
                        'major': '0',
                        'minor': '0',
                        'patch': '1',
                        'build': '0',
                        'platform': 'win',
                        'mac': LoginHandler.GenerateMAC(),
                        'viewer_digest': uuid.v4(),
                        'user_agent': 'nmv',
                        'author': 'tom@caspertech.co.uk',
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
                ], (error, value) =>
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
