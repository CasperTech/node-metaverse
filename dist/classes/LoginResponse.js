"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("./UUID");
const Agent_1 = require("./Agent");
const Region_1 = require("./Region");
const LoginFlags_1 = require("../enums/LoginFlags");
const Vector3_1 = require("./Vector3");
const Long = require("long");
const InventoryFolder_1 = require("./InventoryFolder");
class LoginResponse {
    constructor(json, clientEvents, options) {
        this.events = {
            categories: []
        };
        this.classifieds = {
            categories: []
        };
        this.textures = {};
        this.clientEvents = clientEvents;
        this.agent = new Agent_1.Agent(this.clientEvents);
        this.region = new Region_1.Region(this.agent, this.clientEvents, options);
        Object.keys(json).forEach((key) => {
            const val = json[key];
            switch (key) {
                case 'inventory-skeleton':
                    val.forEach((item) => {
                        const folder = new InventoryFolder_1.InventoryFolder(this.agent.inventory.main);
                        folder.typeDefault = parseInt(item['type_default'], 10);
                        folder.version = parseInt(item['version'], 10);
                        folder.name = String(item['name']);
                        folder.folderID = new UUID_1.UUID(item['folder_id']);
                        folder.parentID = new UUID_1.UUID(item['parent_id']);
                        this.agent.inventory.main.skeleton[folder.folderID.toString()] = folder;
                    });
                    break;
                case 'inventory-skel-lib':
                    val.forEach((item) => {
                        const folder = new InventoryFolder_1.InventoryFolder(this.agent.inventory.library);
                        folder.typeDefault = parseInt(item['type_default'], 10);
                        folder.version = parseInt(item['version'], 10);
                        folder.name = String(item['name']);
                        folder.folderID = new UUID_1.UUID(item['folder_id']);
                        folder.parentID = new UUID_1.UUID(item['parent_id']);
                        this.agent.inventory.library.skeleton[folder.folderID.toString()] = folder;
                    });
                    break;
                case 'inventory-root':
                    {
                        this.agent.inventory.main.root = new UUID_1.UUID(val[0]['folder_id']);
                        const folder = new InventoryFolder_1.InventoryFolder(this.agent.inventory.main);
                        folder.typeDefault = 0;
                        folder.version = 0;
                        folder.name = 'root';
                        folder.folderID = new UUID_1.UUID(val[0]['folder_id']);
                        folder.parentID = UUID_1.UUID.zero();
                        this.agent.inventory.main.skeleton[folder.folderID.toString()] = folder;
                        break;
                    }
                case 'inventory-lib-owner':
                    this.agent.inventory.library.owner = new UUID_1.UUID(val[0]['agent_id']);
                    break;
                case 'inventory-lib-root':
                    {
                        this.agent.inventory.library.root = new UUID_1.UUID(val[0]['folder_id']);
                        const folder = new InventoryFolder_1.InventoryFolder(this.agent.inventory.library);
                        folder.typeDefault = 0;
                        folder.version = 0;
                        folder.name = 'root';
                        folder.folderID = new UUID_1.UUID(val[0]['folder_id']);
                        folder.parentID = UUID_1.UUID.zero();
                        this.agent.inventory.library.skeleton[folder.folderID.toString()] = folder;
                        break;
                    }
                case 'agent_access_max':
                    this.agent.accessMax = String(val);
                    break;
                case 'event_notifications':
                    break;
                case 'secure_session_id':
                    this.region.circuit.secureSessionID = new UUID_1.UUID(val);
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
                    val.forEach((obj) => {
                        if (obj['cloud_texture_id']) {
                            this.textures.cloudTextureID = obj['cloud_texture_id'];
                        }
                        if (obj['sun_texture_id']) {
                            this.textures.sunTextureID = obj['sun_texture_id'];
                        }
                        if (obj['moon_texture_id']) {
                            this.textures.moonTextureID = obj['moon_texture_id'];
                        }
                    });
                    break;
                case 'search_token':
                    this.searchToken = String(val);
                    break;
                case 'login-flags':
                    let flags = 0;
                    val.forEach((obj) => {
                        if (obj['ever_logged_in'] === 'Y') {
                            flags = flags | LoginFlags_1.LoginFlags.everLoggedIn;
                        }
                        if (obj['daylight_savings'] === 'Y') {
                            flags = flags | LoginFlags_1.LoginFlags.daylightSavings;
                        }
                        if (obj['stipend_since_login'] === 'Y') {
                            flags = flags | LoginFlags_1.LoginFlags.stipendSinceLogin;
                        }
                        if (obj['gendered'] === 'Y') {
                            flags = flags | LoginFlags_1.LoginFlags.gendered;
                        }
                    });
                    this.loginFlags = flags;
                    break;
                case 'buddy-list':
                    val.forEach((obj) => {
                        this.agent.buddyList.push({
                            buddyRightsGiven: obj['buddy_rights_given'] !== 0,
                            buddyID: new UUID_1.UUID(obj['buddy_id']),
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
                    val.forEach((item) => {
                        if (item['allow_first_life'] === 'Y') {
                            this.agent.uiFlags.allowFirstLife = true;
                        }
                    });
                    break;
                case 'look_at':
                    this.agent.lookAt = LoginResponse.parseVector3(val);
                    break;
                case 'openid_url':
                    this.agent.openID.url = String(val);
                    break;
                case 'max-agent-groups':
                    this.agent.maxGroups = parseInt(val, 10);
                    break;
                case 'session_id':
                    this.region.circuit.sessionID = new UUID_1.UUID(val);
                    break;
                case 'agent_flags':
                    this.agent.agentFlags = parseInt(val, 10);
                    break;
                case 'event_categories':
                    val.forEach((item) => {
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
                    val.forEach((item) => {
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
                    val.forEach((item) => {
                        this.agent.gestures.push({
                            'assetID': new UUID_1.UUID(item['asset_id']),
                            'itemID': new UUID_1.UUID(item['item_id'])
                        });
                    });
                    break;
                case 'udp_blacklist':
                    const list = String(val).split(',');
                    this.region.circuit.udpBlacklist = list;
                    break;
                case 'agent_id':
                    this.agent.agentID = new UUID_1.UUID(val);
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
    static toRegionHandle(x_global, y_global) {
        let x_origin = x_global;
        x_origin -= x_origin % 256;
        let y_origin = y_global;
        y_origin -= y_origin % 256;
        return new Long(x_origin, y_origin, true);
    }
    static parseVector3(str) {
        const num = str.replace(/[\[\]]r/g, '').split(',');
        const x = parseFloat(num[0]);
        const y = parseFloat(num[1]);
        const z = parseFloat(num[2]);
        return new Vector3_1.Vector3([x, y, z]);
    }
    static parseHome(str) {
        const result = {};
        const json = str.replace(/[\[\]']/g, '\"');
        const parsed = JSON.parse(json);
        if (parsed['region_handle']) {
            const coords = parsed['region_handle'].replace(/r/g, '').split(', ');
            result['regionHandle'] = LoginResponse.toRegionHandle(parseInt(coords[0], 10), parseInt(coords[1], 10));
        }
        if (parsed['position']) {
            result['position'] = this.parseVector3('[' + parsed['position'] + ']');
        }
        if (parsed['look_at']) {
            result['lookAt'] = this.parseVector3('[' + parsed['lookAt'] + ']');
        }
        return result;
    }
}
exports.LoginResponse = LoginResponse;
//# sourceMappingURL=LoginResponse.js.map