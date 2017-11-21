import {Avatar} from './Avatar';
import {UUID} from './UUID';
import {Vector3} from './Vector3';
import {LoginFlags} from '../enums/LoginFlags';

export class LoginResponse
{
    inventory: {
        main: {
            skeleton: [
                {
                    typeDefault: number,
                    version: number,
                    name: string,
                    folderID: UUID,
                    parentID: UUID
                }
                ]
            root?: UUID
        },
        library: {
            owner: UUID,
            skeleton: [
                {
                    typeDefault: number,
                    version: number,
                    name: string,
                    folderID: UUID,
                    parentID: UUID
                }
                ]
            root?: UUID
        }
    };
    agent: {
        'avatar': Avatar,
        'accessMax': string,
        'regionAccess': string,
        'agentAccess': string,
        'loginMessage': string,
        'openID': {
            'token': string,
            'url': string
        }
        'AOTransition': number,
        'loginFlags': LoginFlags,
        'buddyList': {
            'buddyRightsGiven': boolean,
            'buddyID': UUID,
            'buddyRightsHas': boolean
        },
        'ui': {
            'allowFirstLife': boolean
        },
        'lookAt': Vector3,
        'maxGroups': number,
        'agentFlags': number,
        'startLocation': string,
        'cofVersion': number,
        'home': {
            'regionHandle': number,
            'position': Vector3,
            'lookAt': Vector3
        },
        'snapshotConfigURL': string
    };
    circuit: {
        'secureSessionID': UUID,
        'sessionID': UUID,
        'circuitCode': number,
        'udpBlacklist': [
            string
            ],
        'timestamp': number,
        'seedCapability': string
    };
    events: {
        categories: [
            {
                categoryID: number,
                categoryName: string
            }
            ]
    };
    classifieds: {
        categories: [
            {
                categoryID: number,
                categoryName: string
            }
        ]
    };
    region: {
        'x': number,
        'y': number,
        'port': number,
        'IP': string
    };
    textures: {
        'cloudTextureID': UUID,
        'sunTextureID': UUID,
        'moonTextureID': UUID,
    };
    searchToken: string;
    services: {
        agentAppearanceService: string
    };
    gestures: [
        {
            assetID: UUID,
            itemID: UUID
        }
    ];
}
