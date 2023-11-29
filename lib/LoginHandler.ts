import validator from 'validator';
import * as xmlrpc from 'xmlrpc';
import * as fs from 'fs';
import * as path from 'path';
import { LoginError } from './classes/LoginError';
import { LoginParameters } from './classes/LoginParameters';
import { LoginResponse } from './classes/LoginResponse';
import { ClientEvents } from './classes/ClientEvents';
import { Utils } from './classes/Utils';
import { UUID } from './classes/UUID';
import { BotOptionFlags } from './enums/BotOptionFlags';
import { URL } from 'url';
import * as os from 'os';

const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
const packageJson = require(packageJsonPath);
const version = packageJson.version;


export class LoginHandler
{
    private readonly clientEvents: ClientEvents;
    private readonly options: BotOptionFlags;

    constructor(ce: ClientEvents, options: BotOptionFlags)
    {
        this.clientEvents = ce;
        this.options = options;
    }

    public async Login(params: LoginParameters): Promise<LoginResponse>
    {
        const loginURI = new URL(params.url);

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
            path: loginURI.pathname || undefined,
            rejectUnauthorized: false,
            timeout: 60000
        };
        const viewerDigest = 'ce50e500-e6f0-15ab-4b9d-0591afb91ffe';
        const client = (secure) ? xmlrpc.createSecureClient(secureClientOptions) : xmlrpc.createClient(secureClientOptions);

        const nameHash = Utils.SHA1String(params.firstName + params.lastName + viewerDigest);
        const macAddress: string[] = [];
        for (let i = 0; i < 12; i = i + 2)
        {
            macAddress.push(nameHash.substring(i, i + 2));
        }

        let hardwareID: string | null = null;

        const hardwareIDFile = path.resolve(__dirname, 'deviceToken.json');
        try
        {
            const hwID = await fs.promises.readFile(hardwareIDFile);
            const data = JSON.parse(hwID.toString('utf-8'));
            hardwareID = data.id0;
        }
        catch (e: unknown)
        {
            // Ignore any error
        }

        if (hardwareID === null || !validator.isUUID(String(hardwareID)))
        {
            hardwareID = UUID.random().toString();
            await fs.promises.writeFile(hardwareIDFile, JSON.stringify({ id0: hardwareID }));
        }

        const mfaToken = params.token ?? '';
        const mfaHash = params.mfa_hash ?? '';

        return new Promise<LoginResponse>((resolve, reject) =>
        {
            let password = params.password;
            if (params.getHashedPassword)
            {
                password = params.getHashedPassword();
            }

            let platform = '???'
            switch (os.platform())
            {
                case 'darwin':
                    platform = 'mac';
                    break;
                case 'linux':
                    platform = 'lnx';
                    break;
                case 'win32':
                    platform = 'win';
                    break;
            }

            const versions = version.split('.');
            const major = versions.length > 0 ? versions[0] : '0';
            const minor = versions.length > 1 ? versions[1] : '0';
            const patch = versions.length > 2 ? versions[2] : '0';
            let build = major.padStart(2, '0') + minor.padStart(2, '0') + patch.padStart(2, '0');
            build = build.replace(/^0+/, '');

            client.methodCall('login_to_simulator',
                [
                    {
                        first: params.firstName,
                        last: params.lastName,
                        passwd: password,
                        start: params.start,
                        channel: 'libnmv',
                        major,
                        minor,
                        patch,
                        build,
                        platform,
                        version: version + '.' + build,
                        token: mfaToken,
                        mfa_hash: mfaHash,
                        id0: Utils.MD5String(String(hardwareID)),
                        mac: macAddress.join(':'),
                        viewer_digest: viewerDigest,
                        agree_to_tos: params.agreeToTOS,
                        read_critical: params.readCritical,
                        options: [
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
                            reject(new LoginError(value));
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
