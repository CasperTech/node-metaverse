import {UUID} from './UUID';
import {Agent} from './Agent';
import {Region} from './Region';
import {Vector3} from './Vector3';
import Long = require('long');
import {ClientEvents} from './ClientEvents';
import {InventoryFolder} from './InventoryFolder';
import {BotOptionFlags, LoginFlags} from '..';

export class LoginResponse
{
    loginFlags: LoginFlags;
    loginMessage: string;
    agent: Agent;
    region: Region;
    events: {
        categories: {
            categoryID: number,
            categoryName: string
        }[]
    } = {
        categories: []
    };
    classifieds: {
        categories: {
            categoryID: number,
            categoryName: string
        }[]

    } = {
        categories: []
    };
    textures: {
        'cloudTextureID'?: UUID,
        'sunTextureID'?: UUID,
        'moonTextureID'?: UUID,
    } = {};
    searchToken: string;
    clientEvents: ClientEvents;

    private static toRegionHandle(x_global: number, y_global: number): Long
    {
        let x_origin: number = x_global;
        x_origin -= x_origin % 256;
        let y_origin: number = y_global;
        y_origin -= y_origin % 256;
        return new Long(x_origin, y_origin, true);
    }

    private static parseVector3(str: string): Vector3
    {
        const num = str.replace(/[\[\]]r/g, '').split(',');
        const x = parseFloat(num[0]);
        const y = parseFloat(num[1]);
        const z = parseFloat(num[2]);
        return new Vector3([x, y, z]);
    }

    private static parseHome(str: string): {
        'regionHandle'?: Long,
        'position'?: Vector3,
        'lookAt'?: Vector3
    }
    {
        const result: {
            'regionHandle'?: Long,
            'position'?: Vector3,
            'lookAt'?: Vector3
        } = {};

        const json = str.replace(/[\[\]']/g, '\"');
        const parsed = JSON.parse(json);

        if (parsed['region_handle'])
        {
            const coords = parsed['region_handle'].replace(/r/g, '').split(', ');
            result['regionHandle'] = LoginResponse.toRegionHandle(parseInt(coords[0], 10), parseInt(coords[1], 10));
        }
        if (parsed['position'])
        {
            result['position'] = this.parseVector3('[' + parsed['position'] + ']');
        }
        if (parsed['look_at'])
        {
            result['lookAt'] = this.parseVector3('[' + parsed['lookAt'] + ']');
        }


        return result;
    }

    constructor(json: any, clientEvents: ClientEvents, options: BotOptionFlags)
    {
        this.clientEvents = clientEvents;
        this.agent = new Agent(this.clientEvents);
        this.region = new Region(this.agent, this.clientEvents, options);

        if (json['agent_id'])
        {
            this.agent.agentID = new UUID(json['agent_id']);
        }

        Object.keys(json).forEach((key: string) =>
        {
            const val: any = json[key];
            switch (key)
            {
                case 'inventory-skeleton':
                    val.forEach((item: any) =>
                    {
                        const folder = new InventoryFolder(this.agent.inventory.main, this.agent);
                        folder.typeDefault = parseInt(item['type_default'], 10);
                        folder.version = parseInt(item['version'], 10);
                        folder.name = String(item['name']);
                        folder.folderID = new UUID(item['folder_id']);
                        folder.parentID = new UUID(item['parent_id']);
                        this.agent.inventory.main.skeleton[folder.folderID.toString()] = folder;
                    });
                    break;
                case 'inventory-skel-lib':
                    val.forEach((item: any) =>
                    {
                        const folder = new InventoryFolder(this.agent.inventory.library, this.agent);
                        folder.typeDefault = parseInt(item['type_default'], 10);
                        folder.version = parseInt(item['version'], 10);
                        folder.name = String(item['name']);
                        folder.folderID = new UUID(item['folder_id']);
                        folder.parentID = new UUID(item['parent_id']);
                        this.agent.inventory.library.skeleton[folder.folderID.toString()] = folder;
                    });
                    break;
                case 'inventory-root':
                {
                    this.agent.inventory.main.root = new UUID(val[0]['folder_id']);
                    const folder = new InventoryFolder(this.agent.inventory.main, this.agent);
                    folder.typeDefault = 0;
                    folder.version = 0;
                    folder.name = 'root';
                    folder.folderID = new UUID(val[0]['folder_id']);
                    folder.parentID = UUID.zero();
                    this.agent.inventory.main.skeleton[folder.folderID.toString()] = folder;
                    break;
                }
                case 'inventory-lib-owner':
                    this.agent.inventory.library.owner = new UUID(val[0]['agent_id']);
                    break;
                case 'inventory-lib-root':
                {
                    this.agent.inventory.library.root = new UUID(val[0]['folder_id']);
                    const folder = new InventoryFolder(this.agent.inventory.library, this.agent);
                    folder.typeDefault = 0;
                    folder.version = 0;
                    folder.name = 'root';
                    folder.folderID = new UUID(val[0]['folder_id']);
                    folder.parentID = UUID.zero();
                    this.agent.inventory.library.skeleton[folder.folderID.toString()] = folder;
                    break;
                }
                case 'agent_access_max':
                    this.agent.accessMax = String(val);
                    break;
                case 'event_notifications':
                    // dunno what this does just yet
                    break;
                case 'secure_session_id':
                    this.region.circuit.secureSessionID = new UUID(val);
                    break;
                case 'openid_token':
                    this.agent.openID.token = String(val);
                    break;
                case 'region_x':
                    this.region.xCoordinate = parseInt(val, 10);
                    break;
                case 'ao_transition':
                    this.agent.AOTransition = (val !== 0);
                    break;
                case 'global-textures':
                    val.forEach((obj: any) =>
                    {
                        if (obj['cloud_texture_id'])
                        {
                            this.textures.cloudTextureID = obj['cloud_texture_id'];
                        }
                        if (obj['sun_texture_id'])
                        {
                            this.textures.sunTextureID = obj['sun_texture_id'];
                        }
                        if (obj['moon_texture_id'])
                        {
                            this.textures.moonTextureID = obj['moon_texture_id'];
                        }
                    });
                    break;
                case 'search_token':
                    this.searchToken = String(val);
                    break;
                case 'login-flags':
                    let flags: LoginFlags = 0;
                    val.forEach((obj: any) =>
                    {
                        if (obj['ever_logged_in'] === 'Y')
                        {
                            flags = flags | LoginFlags.everLoggedIn;
                        }
                        if (obj['daylight_savings'] === 'Y')
                        {
                            flags = flags | LoginFlags.daylightSavings;
                        }
                        if (obj['stipend_since_login'] === 'Y')
                        {
                            flags = flags | LoginFlags.stipendSinceLogin;
                        }
                        if (obj['gendered'] === 'Y')
                        {
                            flags = flags | LoginFlags.gendered;
                        }
                    });
                    this.loginFlags = flags;
                    break;
                case 'buddy-list':
                    val.forEach((obj: any) =>
                    {
                        this.agent.buddyList.push({
                            buddyRightsGiven: obj['buddy_rights_given'] !== 0,
                            buddyID: new UUID(obj['buddy_id']),
                            buddyRightsHas: obj['buddy_rights_has'] !== 0,
                        });
                    });
                    break;
                case 'sim_port':
                    this.region.circuit.port = parseInt(val, 10);
                    break;
                case 'sim_ip':
                    this.region.circuit.ipAddress = String(val);
                    break;
                case 'agent_appearance_service':
                    this.agent.agentAppearanceService = val;
                    break;
                case 'ui-config':
                    val.forEach((item: any) =>
                    {
                        if (item['allow_first_life'] === 'Y')
                        {
                            this.agent.uiFlags.allowFirstLife = true;
                        }
                    });
                    break;
                case 'look_at':
                    this.agent.cameraLookAt = LoginResponse.parseVector3(val);
                    break;
                case 'openid_url':
                    this.agent.openID.url = String(val);
                    break;
                case 'max-agent-groups':
                    this.agent.maxGroups = parseInt(val, 10);
                    break;
                case 'session_id':
                    this.region.circuit.sessionID = new UUID(val);
                    break;
                case 'agent_flags':
                    this.agent.agentFlags = parseInt(val, 10);
                    break;
                case 'event_categories':
                    val.forEach((item: any) =>
                    {
                        this.events.categories.push({
                            'categoryID': parseInt(item['category_id'], 10),
                            'categoryName': String(item['category_name'])
                        });
                    });
                    break;
                case 'start_location':
                    this.agent.startLocation = String(val);
                    break;
                case 'agent_region_access':
                    this.agent.regionAccess = String(val);
                    break;
                case 'last_name':
                    this.agent.lastName = String(val);
                    break;
                case 'cof_version':
                    this.agent.cofVersion = parseInt(val, 10);
                    break;
                case 'home':
                    this.agent.home = LoginResponse.parseHome(val);
                    break;
                case 'classified_categories':
                    val.forEach((item: any) =>
                    {
                        this.classifieds.categories.push({
                            'categoryID': parseInt(item['category_id'], 10),
                            'categoryName': String(item['category_name'])
                        });
                    });
                    break;
                case 'snapshot_config_url':
                    this.agent.snapshotConfigURL = String(val);
                    break;
                case 'region_y':
                    this.region.yCoordinate = parseInt(val, 10);
                    break;
                case 'agent_access':
                    this.agent.agentAccess = String(val);
                    break;
                case 'circuit_code':
                    this.region.circuit.circuitCode = parseInt(val, 10);
                    break;
                case 'message':
                    this.loginMessage = String(val);
                    break;
                case 'gestures':
                    val.forEach((item: any) =>
                    {
                        this.agent.gestures.push({
                            'assetID': new UUID(item['asset_id']),
                            'itemID': new UUID(item['item_id'])
                        });
                    });
                    break;
                case 'udp_blacklist':
                    const list = String(val).split(',');
                    this.region.circuit.udpBlacklist = list;
                    break;
                case 'seconds_since_epoch':
                    this.region.circuit.timestamp = parseInt(val, 10);
                    break;
                case 'seed_capability':
                    this.region.activateCaps(String(val));
                    break;
                case 'first_name':
                    this.agent.firstName = String(val).replace(/"/g, '');
                    break;

            }
        });
        this.agent.setCurrentRegion(this.region);
    }
}
