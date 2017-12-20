"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LLSD = require("@caspertech/llsd");
const request = require("request");
const Subject_1 = require("rxjs/Subject");
const EventQueueClient_1 = require("./EventQueueClient");
class Caps {
    constructor(agent, region, seedURL, clientEvents) {
        this.onGotSeedCap = new Subject_1.Subject();
        this.gotSeedCap = false;
        this.capabilities = {};
        this.eventQueueClient = null;
        this.agent = agent;
        this.clientEvents = clientEvents;
        this.region = region;
        const req = [];
        req.push('AgentPreferences');
        req.push('AgentState');
        req.push('AttachmentResources');
        req.push('AvatarPickerSearch');
        req.push('AvatarRenderInfo');
        req.push('CharacterProperties');
        req.push('ChatSessionRequest');
        req.push('CopyInventoryFromNotecard');
        req.push('CreateInventoryCategory');
        req.push('DispatchRegionInfo');
        req.push('DirectDelivery');
        req.push('EnvironmentSettings');
        req.push('EstateChangeInfo');
        req.push('EventQueueGet');
        req.push('FacebookConnect');
        req.push('FlickrConnect');
        req.push('TwitterConnect');
        req.push('FetchLib2');
        req.push('FetchLibDescendents2');
        req.push('FetchInventory2');
        req.push('FetchInventoryDescendents2');
        req.push('IncrementCOFVersion');
        req.push('GetDisplayNames');
        req.push('GetExperiences');
        req.push('AgentExperiences');
        req.push('FindExperienceByName');
        req.push('GetExperienceInfo');
        req.push('GetAdminExperiences');
        req.push('GetCreatorExperiences');
        req.push('ExperiencePreferences');
        req.push('GroupExperiences');
        req.push('UpdateExperience');
        req.push('IsExperienceAdmin');
        req.push('IsExperienceContributor');
        req.push('RegionExperiences');
        req.push('GetMetadata');
        req.push('GetObjectCost');
        req.push('GetObjectPhysicsData');
        req.push('GroupAPIv1');
        req.push('GroupMemberData');
        req.push('GroupProposalBallot');
        req.push('HomeLocation');
        req.push('LandResources');
        req.push('LSLSyntax');
        req.push('MapLayer');
        req.push('MapLayerGod');
        req.push('MeshUploadFlag');
        req.push('NavMeshGenerationStatus');
        req.push('NewFileAgentInventory');
        req.push('ObjectMedia');
        req.push('ObjectMediaNavigate');
        req.push('ObjectNavMeshProperties');
        req.push('ParcelPropertiesUpdate');
        req.push('ParcelVoiceInfoRequest');
        req.push('ProductInfoRequest');
        req.push('ProvisionVoiceAccountRequest');
        req.push('RemoteParcelRequest');
        req.push('RenderMaterials');
        req.push('RequestTextureDownload');
        req.push('ResourceCostSelected');
        req.push('RetrieveNavMeshSrc');
        req.push('SearchStatRequest');
        req.push('SearchStatTracking');
        req.push('SendPostcard');
        req.push('SendUserReport');
        req.push('SendUserReportWithScreenshot');
        req.push('ServerReleaseNotes');
        req.push('SetDisplayName');
        req.push('SimConsoleAsync');
        req.push('SimulatorFeatures');
        req.push('StartGroupProposal');
        req.push('TerrainNavMeshProperties');
        req.push('TextureStats');
        req.push('UntrustedSimulatorMessage');
        req.push('UpdateAgentInformation');
        req.push('UpdateAgentLanguage');
        req.push('UpdateAvatarAppearance');
        req.push('UpdateGestureAgentInventory');
        req.push('UpdateGestureTaskInventory');
        req.push('UpdateNotecardAgentInventory');
        req.push('UpdateNotecardTaskInventory');
        req.push('UpdateScriptAgent');
        req.push('UpdateScriptTask');
        req.push('UploadBakedTexture');
        req.push('ViewerAsset');
        req.push('ViewerMetrics');
        req.push('ViewerStartAuction');
        req.push('ViewerStats');
        this.request(seedURL, LLSD.LLSD.formatXML(req), 'application/llsd+xml').then((body) => {
            this.capabilities = LLSD.LLSD.parseXML(body);
            this.gotSeedCap = true;
            this.onGotSeedCap.next();
            if (this.capabilities['EventQueueGet']) {
                if (this.eventQueueClient !== null) {
                    this.eventQueueClient.shutdown();
                }
                this.eventQueueClient = new EventQueueClient_1.EventQueueClient(this.agent, this, this.clientEvents);
            }
        }).catch((err) => {
            console.error('Error getting seed capability');
            console.error(err);
        });
    }
    downloadAsset(uuid, type) {
        return new Promise((resolve, reject) => {
            this.getCapability('ViewerAsset').then((url) => {
                const assetURL = url + '/?' + type + '_id=' + uuid.toString();
                request({
                    'uri': assetURL,
                    'rejectUnauthorized': false,
                    'method': 'GET',
                    'encoding': null
                }, (err, res, body) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(body);
                    }
                });
            });
        });
    }
    request(url, data, contentType) {
        return new Promise((resolve, reject) => {
            request({
                'headers': {
                    'Content-Length': data.length,
                    'Content-Type': contentType
                },
                'uri': url,
                'body': data,
                'rejectUnauthorized': false,
                'method': 'POST'
            }, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(body);
                }
            });
        });
    }
    waitForSeedCapability() {
        return new Promise((resolve, reject) => {
            if (this.gotSeedCap) {
                resolve();
            }
            else {
                const sub = this.onGotSeedCap.subscribe(() => {
                    sub.unsubscribe();
                    resolve();
                });
            }
        });
    }
    getCapability(capability) {
        return new Promise((resolve, reject) => {
            this.waitForSeedCapability().then(() => {
                if (this.capabilities[capability]) {
                    resolve(this.capabilities[capability]);
                }
                else {
                    reject(new Error('Capability not available'));
                }
            });
        });
    }
    capsRequestUpload(url, data) {
        return new Promise((resolve, reject) => {
            this.request(url, data, 'application/octet-stream').then((body) => {
                resolve(LLSD.LLSD.parseXML(body));
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }
    capsRequestXML(capability, data) {
        return new Promise((resolve, reject) => {
            this.getCapability(capability).then((url) => {
                this.request(url, LLSD.LLSD.formatXML(data), 'application/llsd+xml').then((body) => {
                    let result = null;
                    try {
                        result = LLSD.LLSD.parseXML(body);
                    }
                    catch (err) {
                        console.error('Error parsing LLSD');
                        console.error(body);
                        reject(err);
                    }
                    resolve(result);
                }).catch((err) => {
                    console.error(err);
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    shutdown() {
        this.onGotSeedCap.complete();
        if (this.eventQueueClient) {
            this.eventQueueClient.shutdown();
        }
    }
}
exports.Caps = Caps;
//# sourceMappingURL=Caps.js.map