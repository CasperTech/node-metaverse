import { Subscription } from 'rxjs/internal/Subscription';
import { EventQueueClient } from './EventQueueClient';
import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
import { Agent } from './Agent';
import { Subject } from 'rxjs/internal/Subject';
import { ICapResponse } from './interfaces/ICapResponse';
import { HTTPAssets } from '../enums/HTTPAssets';

import * as LLSD from '@caspertech/llsd';
import * as request from 'request';
import * as url from 'url';

export class Caps
{
    static CAP_INVOCATION_DELAY_MS: {[key: string]: number} = {
        'NewFileAgentInventory': 2000,
        'FetchInventory2': 200
    };

    private onGotSeedCap: Subject<void> = new Subject<void>();
    private gotSeedCap = false;
    private capabilities: { [key: string]: string } = {};
    private clientEvents: ClientEvents;
    private agent: Agent;
    private active = false;
    private timeLastCapExecuted: {[key: string]: number} = {};
    eventQueueClient: EventQueueClient | null = null;

    constructor(agent: Agent, seedURL: string, clientEvents: ClientEvents)
    {
        this.agent = agent;
        this.clientEvents = clientEvents;
        const req: string[] = [];
        req.push('AbuseCategories');
        req.push('AcceptFriendship');
        req.push('AcceptGroupInvite');
        req.push('AgentPreferences');
        req.push('AgentState');
        req.push('AttachmentResources');
        req.push('AvatarPickerSearch');
        req.push('AvatarRenderInfo');
        req.push('CharacterProperties');
        req.push('ChatSessionRequest');
        req.push('CopyInventoryFromNotecard');
        req.push('CreateInventoryCategory');
        req.push('DeclineFriendship');
        req.push('DeclineGroupInvite');
        req.push('DispatchRegionInfo');
        req.push('DirectDelivery');
        req.push('EnvironmentSettings');
        req.push('EstateAccess');
        req.push('EstateChangeInfo');
        req.push('EventQueueGet');
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
        req.push('ObjectAnimation');
        req.push('ObjectMedia');
        req.push('ObjectMediaNavigate');
        req.push('ObjectNavMeshProperties');
        req.push('ParcelPropertiesUpdate');
        req.push('ParcelVoiceInfoRequest');
        req.push('ProductInfoRequest');
        req.push('ProvisionVoiceAccountRequest');
        req.push('ReadOfflineMsgs');
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
        req.push('UserInfo');
        req.push('ViewerAsset');
        req.push('ViewerMetrics');
        req.push('ViewerStartAuction');
        req.push('ViewerStats');
        req.push('InventoryAPIv3');

        this.active = true;
        this.request(seedURL, LLSD.LLSD.formatXML(req), 'application/llsd+xml').then((resp: ICapResponse) =>
        {
            this.capabilities = LLSD.LLSD.parseXML(resp.body);
            this.gotSeedCap = true;
            this.onGotSeedCap.next();
            if (this.capabilities['EventQueueGet'])
            {
                if (this.eventQueueClient !== null)
                {
                    this.eventQueueClient.shutdown();
                }
                this.eventQueueClient = new EventQueueClient(this.agent, this, this.clientEvents);
            }
        }).catch((err) =>
        {
            console.error('Error getting seed capability');
            console.error(err);
        });
    }

    async downloadAsset(uuid: UUID, type: HTTPAssets): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            if (type === HTTPAssets.ASSET_LSL_TEXT || type === HTTPAssets.ASSET_NOTECARD)
            {
                throw new Error('Invalid Syntax');
            }
            this.getCapability('ViewerAsset').then((capURL) =>
            {
                const assetURL = capURL + '/?' + type + '_id=' + uuid.toString();
                request({
                    'uri': assetURL,
                    'rejectUnauthorized': false,
                    'method': 'GET',
                    'encoding': null
                }, (err, _res, body) =>
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(body);
                    }
                });
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }

    request(capURL: string, data: string | Buffer, contentType: string): Promise<ICapResponse>
    {
        return new Promise<ICapResponse>((resolve, reject) =>
        {
            request({
                'headers': {
                    'Content-Length': data.length,
                    'Content-Type': contentType
                },
                'uri': capURL,
                'body': data,
                'rejectUnauthorized': false,
                'method': 'POST'
            }, (err, res, body) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve({status: res.statusCode, body: body});
                }
            });
        });
    }

    requestPut(capURL: string, data: string | Buffer, contentType: string): Promise<ICapResponse>
    {
        return new Promise<ICapResponse>((resolve, reject) =>
        {
            request({
                'headers': {
                    'Content-Length': data.length,
                    'Content-Type': contentType
                },
                'uri': capURL,
                'body': data,
                'rejectUnauthorized': false,
                'method': 'PUT'
            }, (err, res, body) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve({status: res.statusCode, body: body});
                }
            });
        });
    }

    requestGet(requestURL: string): Promise<ICapResponse>
    {
        return new Promise<ICapResponse>((resolve, reject) =>
        {
            request({
                'uri': requestURL,
                'rejectUnauthorized': false,
                'method': 'GET'
            }, (err, res, body) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve({status: res.statusCode, body: body});
                }
            });
        });
    }

    requestDelete(requestURL: string): Promise<ICapResponse>
    {
        return new Promise<ICapResponse>((resolve, reject) =>
        {
            request({
                'uri': requestURL,
                'rejectUnauthorized': false,
                'method': 'DELETE'
            }, (err, res, body) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve({status: res.statusCode, body: body});
                }
            });
        });
    }

    waitForSeedCapability(): Promise<void>
    {
        return new Promise((resolve) =>
        {
            if (this.gotSeedCap)
            {
                resolve();
            }
            else
            {
                const sub: Subscription = this.onGotSeedCap.subscribe(() =>
                {
                    sub.unsubscribe();
                    resolve();
                });
            }
        });
    }

    async isCapAvailable(capability: string): Promise<boolean>
    {
        await this.waitForSeedCapability();
        return (this.capabilities[capability] !== undefined);
    }

    getCapability(capability: string): Promise<string>
    {
        return new Promise<string>((resolve, reject) =>
        {
            if (!this.active)
            {
                reject(new Error('Requesting getCapability to an inactive Caps instance'));
                return;
            }
            this.waitForSeedCapability().then(() =>
            {
                if (this.capabilities[capability])
                {
                    resolve(this.capabilities[capability]);
                }
                else
                {
                    reject(new Error('Capability ' + capability + ' not available'));
                }
            });
        });
    }

    capsRequestUpload(capURL: string, data: Buffer): Promise<any>
    {
        return new Promise<any>((resolve, reject) =>
        {
            this.request(capURL, data, 'application/octet-stream').then((resp: ICapResponse) =>
            {
                try
                {
                    resolve(LLSD.LLSD.parseXML(resp.body));
                }
                catch (err)
                {
                    if (resp.status === 201)
                    {
                        resolve({});
                    }
                    else if (resp.status === 403)
                    {
                        reject(new Error('Access Denied'));
                    }
                    else
                    {
                        reject(err);
                    }
                }
            }).catch((err) =>
            {
                console.error(err);
                reject(err);
            });
        });
    }

    private waitForCapTimeout(capName: string): Promise<void>
    {
        return new Promise((resolve) =>
        {
            if (!Caps.CAP_INVOCATION_DELAY_MS[capName])
            {
                resolve();
            }
            else
            {
                if (!this.timeLastCapExecuted[capName] || this.timeLastCapExecuted[capName] < (new Date().getTime() - Caps.CAP_INVOCATION_DELAY_MS[capName]))
                {
                    this.timeLastCapExecuted[capName] = new Date().getTime();
                }
                else
                {
                    this.timeLastCapExecuted[capName] += Caps.CAP_INVOCATION_DELAY_MS[capName];
                }
                const timeToWait = this.timeLastCapExecuted[capName] - new Date().getTime();
                if (timeToWait > 0)
                {
                    setTimeout(() =>
                    {
                        resolve();
                    }, timeToWait);
                }
                else
                {
                    resolve();
                }
            }
        });
    }

    capsPerformXMLPost(capURL: string, data: any): Promise<any>
    {
        return new Promise<any>(async (resolve, reject) =>
        {
            const xml = LLSD.LLSD.formatXML(data);
            this.request(capURL, xml, 'application/llsd+xml').then(async (resp: ICapResponse) =>
            {
                let result: any = null;
                try
                {
                    result = LLSD.LLSD.parseXML(resp.body);
                    resolve(result);
                }
                catch (err)
                {
                    if (resp.status === 201)
                    {
                        resolve({});
                    }
                    else if (resp.status === 403)
                    {
                        reject(new Error('Access Denied'));
                    }
                    else if (resp.status === 404)
                    {
                        reject(new Error('Not found'));
                    }
                    else
                    {
                        reject(resp.body);
                    }
                }
            }).catch((err) =>
            {
                console.error(err);
                reject(err);
            });
        });
    }

    capsPerformXMLPut(capURL: string, data: any): Promise<any>
    {
        return new Promise<any>(async (resolve, reject) =>
        {
            const xml = LLSD.LLSD.formatXML(data);
            this.requestPut(capURL, xml, 'application/llsd+xml').then((resp: ICapResponse) =>
            {
                let result: any = null;
                try
                {
                    result = LLSD.LLSD.parseXML(resp.body);
                    resolve(result);
                }
                catch (err)
                {
                    if (resp.status === 201)
                    {
                        resolve({});
                    }
                    else if (resp.status === 403)
                    {
                        reject(new Error('Access Denied'));
                    }
                    else
                    {
                        reject(err);
                    }
                }
            }).catch((err) =>
            {
                console.error(err);
                reject(err);
            });
        });
    }

    capsPerformXMLGet(capURL: string): Promise<any>
    {
        return new Promise<any>(async (resolve, reject) =>
        {
            this.requestGet(capURL).then((resp: ICapResponse) =>
            {
                let result: any = null;
                try
                {
                    result = LLSD.LLSD.parseXML(resp.body);
                    resolve(result);
                }
                catch (err)
                {
                    if (resp.status === 201)
                    {
                        resolve({});
                    }
                    else if (resp.status === 403)
                    {
                        reject(new Error('Access Denied'));
                    }
                    else
                    {
                        reject(err);
                    }
                }
            }).catch((err) =>
            {
                console.error(err);
                reject(err);
            });
        });
    }

    async capsGetXML(capability: string | [string, {[key: string]: string}]): Promise<any>
    {
        let capName = '';
        let queryParams: {[key: string]: string} = {};
        if (typeof capability === 'string')
        {
            capName = capability;
        }
        else
        {
            capName = capability[0];
            queryParams = capability[1];
        }

        await this.waitForCapTimeout(capName);

        let capURL = await this.getCapability(capName);
        if (Object.keys(queryParams).length > 0)
        {
            const parsedURL = url.parse(capURL, true);
            for (const key of Object.keys(queryParams))
            {
                parsedURL.query[key] = queryParams[key];
            }
            capURL = url.format(parsedURL);
        }
        try
        {
            return await this.capsPerformXMLGet(capURL);
        }
        catch (error)
        {
            console.log('Error with cap ' + capName);
            console.log(error);
            throw error;
        }
    }

    async capsPostXML(capability: string | [string, {[key: string]: string}], data: any): Promise<any>
    {
        let capName = '';
        let queryParams: {[key: string]: string} = {};
        if (typeof capability === 'string')
        {
            capName = capability;
        }
        else
        {
            capName = capability[0];
            queryParams = capability[1];
        }

        await this.waitForCapTimeout(capName);

        let capURL = await this.getCapability(capName);
        if (Object.keys(queryParams).length > 0)
        {
            const parsedURL = url.parse(capURL, true);
            for (const key of Object.keys(queryParams))
            {
                parsedURL.query[key] = queryParams[key];
            }
            capURL = url.format(parsedURL);
        }
        try
        {
            return await this.capsPerformXMLPost(capURL, data);
        }
        catch (error)
        {
            console.log('Error with cap ' + capName);
            console.log(error);
            throw error;
        }
    }

    async capsPutXML(capability: string | [string, {[key: string]: string}], data: any): Promise<any>
    {
        let capName = '';
        let queryParams: {[key: string]: string} = {};
        if (typeof capability === 'string')
        {
            capName = capability;
        }
        else
        {
            capName = capability[0];
            queryParams = capability[1];
        }

        await this.waitForCapTimeout(capName);

        let capURL = await this.getCapability(capName);
        if (Object.keys(queryParams).length > 0)
        {
            const parsedURL = url.parse(capURL, true);
            for (const key of Object.keys(queryParams))
            {
                parsedURL.query[key] = queryParams[key];
            }
            capURL = url.format(parsedURL);
        }
        try
        {
            return await this.capsPerformXMLPut(capURL, data);
        }
        catch (error)
        {
            console.log('Error with cap ' + capName);
            console.log(error);
            throw error;
        }
    }

    shutdown(): void
    {
        this.onGotSeedCap.complete();
        if (this.eventQueueClient)
        {
            this.eventQueueClient.shutdown();
        }
        this.active = false;
    }
}
