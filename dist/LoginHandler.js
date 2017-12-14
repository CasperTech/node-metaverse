"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlrpc = require("xmlrpc");
const crypto = require("crypto");
const LoginResponse_1 = require("./classes/LoginResponse");
const uuid = require('uuid');
class LoginHandler {
    static GenerateMAC() {
        const hexDigits = '0123456789ABCDEF';
        let macAddress = '';
        for (let i = 0; i < 6; i++) {
            macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
            macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
            if (i !== 5) {
                macAddress += ':';
            }
        }
        return macAddress;
    }
    constructor(ce, options) {
        this.clientEvents = ce;
        this.options = options;
    }
    Login(params) {
        return new Promise((resolve, reject) => {
            const secureClientOptions = {
                host: 'login.agni.lindenlab.com',
                port: 443,
                path: '/cgi-bin/login.cgi',
                rejectUnauthorized: false
            };
            const client = xmlrpc.createSecureClient(secureClientOptions);
            client.methodCall('login_to_simulator', [
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
            ], (error, value) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (!value['login'] || value['login'] === 'false') {
                        reject(new Error(value['message']));
                    }
                    else {
                        const response = new LoginResponse_1.LoginResponse(value, this.clientEvents, this.options);
                        resolve(response);
                    }
                }
            });
        });
    }
}
exports.LoginHandler = LoginHandler;
//# sourceMappingURL=LoginHandler.js.map