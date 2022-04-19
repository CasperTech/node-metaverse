import * as xmlrpc from 'xmlrpc';
import * as crypto from 'crypto';
import * as url from 'url';
import { Logger } from './classes/Logger';
import { LoginParameters } from './classes/LoginParameters';
import { LoginResponse } from './classes/LoginResponse';
import { ClientEvents } from './classes/ClientEvents';
import { Utils } from './classes/Utils';
import { BotOptionFlags } from './enums/BotOptionFlags';

export class LoginHandler
{
    private clientEvents: ClientEvents;
    private options: BotOptionFlags;

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
            const viewerDigest = 'ce50e500-e6f0-15ab-4b9d-0591afb91ffe';
            const client = (secure) ? xmlrpc.createSecureClient(secureClientOptions) : xmlrpc.createClient(secureClientOptions);

            const nameHash = Utils.SHA1String(params.firstName + params.lastName + viewerDigest);
            const macAddress: string[] = [];
            for (let i = 0; i < 12; i = i + 2)
            {
                macAddress.push(nameHash.substr(i, 2));
            }

            client.methodCall('login_to_simulator',
                [
                    {
                        'first': params.firstName,
                        'last': params.lastName,
                        'passwd': '$1$' + crypto.createHash('md5').update(params.password.substr(0, 16)).digest('hex'),
                        'start': params.start,
                        'major': '0',
                        'minor': '0',
                        'patch': '1',
                        'build': '0',
                        'platform': 'win',
                        'mac': macAddress.join(':'),
                        'viewer_digest': viewerDigest,
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
