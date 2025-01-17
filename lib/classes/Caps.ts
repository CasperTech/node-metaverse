import type { Subscription } from 'rxjs';
import { EventQueueClient } from './EventQueueClient';
import type { UUID } from './UUID';
import type { ClientEvents } from './ClientEvents';
import type { Agent } from './Agent';
import { Subject } from 'rxjs';
import type { ICapResponse } from './interfaces/ICapResponse';

import * as LLSD from '@caspertech/llsd';
import * as url from 'url';
import got from 'got';
import { AssetType } from '../enums/AssetType';
import { AssetTypeRegistry } from './AssetTypeRegistry';

export class Caps
{
    public eventQueueClient: EventQueueClient | null = null;

    private static readonly CAP_INVOCATION_DELAY_MS: Record<string, number> = {
        'NewFileAgentInventory': 2000,
        'FetchInventory2': 200
    };

    private readonly onGotSeedCap: Subject<void> = new Subject<void>();
    private gotSeedCap = false;
    private capabilities: Record<string, string> = {};
    private readonly clientEvents: ClientEvents;
    private readonly agent: Agent;
    private active = false;
    private timeLastCapExecuted: Record<string, number> = {};

    public constructor(agent: Agent, seedURL: string, clientEvents: ClientEvents)
    {
        this.agent = agent;
        this.clientEvents = clientEvents;
        const req: string[] = [];
        req.push('AbuseCategories');
        req.push('AcceptFriendship');
        req.push('AcceptGroupInvite');
        req.push('AgentPreferences');
        req.push('AgentProfile');
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
        req.push('ExtEnvironment');
        req.push('FetchLib2');
        req.push('FetchLibDescendents2');
        req.push('FetchInventory2');
        req.push('FetchInventoryDescendents2');
        req.push('IncrementCOFVersion');
        req.push('InterestList');
        req.push('InventoryThumbnailUpload');
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
        req.push('ExperienceQuery');
        req.push('GetMesh');
        req.push('GetMesh2');
        req.push('GetMetadata');
        req.push('GetObjectCost');
        req.push('GetObjectPhysicsData');
        req.push('GetTexture');
        req.push('GroupAPIv1');
        req.push('GroupMemberData');
        req.push('GroupProposalBallot');
        req.push('HomeLocation');
        req.push('LandResources');
        req.push('LSLSyntax');
        req.push('MapLayer');
        req.push('MapLayerGod');
        req.push('MeshUploadFlag');
        req.push('ModifyMaterialParams');
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
        req.push('RegionObjects');
        req.push('RemoteParcelRequest');
        req.push('RenderMaterials');
        req.push('RequestTextureDownload');
        req.push('RequestTaskInventory');
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
        req.push('UpdateSettingsAgentInventory');
        req.push('UpdateSettingsTaskInventory');
        req.push('UploadAgentProfileImage');
        req.push('UpdateMaterialAgentInventory');
        req.push('UpdateMaterialTaskInventory');
        req.push('UploadBakedTexture');
        req.push('UserInfo');
        req.push('ViewerAsset');
        req.push('ViewerBenefits');
        req.push('ViewerMetrics');
        req.push('ViewerStartAuction');
        req.push('ViewerStats');

        this.active = true;
        this.requestPost(seedURL, LLSD.LLSD.formatXML(req), 'application/llsd+xml').then((resp: ICapResponse) =>
        {
            this.capabilities = LLSD.LLSD.parseXML(resp.body);
            this.gotSeedCap = true;
            this.onGotSeedCap.next();
            if (this.capabilities.EventQueueGet)
            {
                if (this.eventQueueClient !== null)
                {
                    void this.eventQueueClient.shutdown();
                }
                this.eventQueueClient = new EventQueueClient(this.agent, this, this.clientEvents);
            }
        }).catch((err: unknown) =>
        {
            console.error('Error getting seed capability');
            console.error(err);
        });
    }

    public async downloadAsset(uuid: UUID, type: AssetType): Promise<Buffer>
    {
        if (type === AssetType.LSLText || type === AssetType.Notecard)
        {
            throw new Error('Invalid Syntax');
        }

        const capURL = await this.getCapability('ViewerAsset');
        const assetURL = capURL + '/?' + AssetTypeRegistry.getTypeName(type) + '_id=' + uuid.toString();

        const response = await got.get(assetURL, {
            https: {
                rejectUnauthorized: false,
            },
            method: 'GET',
            responseType: 'buffer'
        });

        if (response.statusCode < 200 || response.statusCode > 299)
        {
            throw new Error(response.body.toString('utf-8'));
        }

        return response.body;
    }

    public async requestPost(capURL: string, data: string | Buffer, contentType: string): Promise<{ status: number, body: string }>
    {
        const response = await got.post(capURL, {
            headers: {
                'Content-Length': String(Buffer.byteLength(data)),
                'Content-Type': contentType
            },
            body: data,
            https: {
                rejectUnauthorized: false,
            },
        });

        return { status: response.statusCode, body: response.body };
    }

    public async requestPut(capURL: string, data: string | Buffer, contentType: string): Promise<ICapResponse>
    {
        const response = await got.put(capURL, {
            headers: {
                'Content-Length': String(Buffer.byteLength(data)),
                'Content-Type': contentType
            },
            body: data,
            https: {
                rejectUnauthorized: false,
            },
        });

        return { status: response.statusCode, body: response.body };
    }

    public async requestGet(requestURL: string): Promise<ICapResponse>
    {
        const response = await got.get(requestURL, {
            https: {
                rejectUnauthorized: false,
            },
        });

        return { status: response.statusCode, body: response.body };
    }

    public async requestDelete(requestURL: string): Promise<ICapResponse>
    {
        const response = await got.delete(requestURL, {
            https: {
                rejectUnauthorized: false,
            },
        });

        return { status: response.statusCode, body: response.body };
    }

    public async isCapAvailable(capability: string): Promise<boolean>
    {
        await this.waitForSeedCapability();
        return (this.capabilities[capability] !== undefined);
    }

    public async getCapability(capability: string): Promise<string>
    {
        if (!this.active)
        {
            throw new Error('Requesting getCapability to an inactive Caps instance');
        }
        await this.waitForSeedCapability();
        if (this.capabilities[capability] !== undefined)
        {
            return this.capabilities[capability];
        }
        throw new Error('Capability ' + capability + ' not available')
    }

    public async capsRequestUpload(capURL: string, data: Buffer): Promise<any>
    {
        const resp: ICapResponse = await this.requestPost(capURL, data, 'application/octet-stream');
        try
        {
            return LLSD.LLSD.parseXML(resp.body);
        }
        catch (err)
        {
            if (resp.status === 201)
            {
                return resp.body;
            }
            else if (resp.status === 403)
            {
                throw new Error('Access Denied');
            }
            throw(err);
        }
    }

    public async capsPerformXMLPost(capURL: string, data: any): Promise<any>
    {
        const xml = LLSD.LLSD.formatXML(data);
        const resp: ICapResponse = await this.requestPost(capURL, xml, 'application/llsd+xml');
        try
        {
            return LLSD.LLSD.parseXML(resp.body);
        }
        catch (_err: unknown)
        {
            if (resp.status === 201)
            {
                return {};
            }
            else if (resp.status === 403)
            {
                throw new Error('Access Denied');
            }
            else if (resp.status === 404)
            {
                throw new Error('Not found');
            }
            else
            {
                // eslint-disable-next-line @typescript-eslint/only-throw-error
                throw resp.body;
            }
        }
    }

    public async capsPerformXMLPut(capURL: string, data: any): Promise<any>
    {
        const xml = LLSD.LLSD.formatXML(data);
        const resp: ICapResponse = await this.requestPut(capURL, xml, 'application/llsd+xml');
        try
        {
            return LLSD.LLSD.parseXML(resp.body);
        }
        catch (err)
        {
            if (resp.status === 201)
            {
                return {};
            }
            else if (resp.status === 403)
            {
                throw new Error('Access Denied');
            }
            else
            {
                throw err;
            }
        }
    }

    public async capsPerformXMLGet(capURL: string): Promise<any>
    {
        const resp = await this.requestGet(capURL);
        try
        {
            return LLSD.LLSD.parseXML(resp.body);
        }
        catch (err)
        {
            if (resp.status === 201)
            {
                return {};
            }
            else if (resp.status === 403)
            {
                throw new Error('Access Denied');
            }
            else
            {
                throw err;
            }
        }
    }

    public async capsPerformGet(capURL: string): Promise<string>
    {
        const resp = await this.requestGet(capURL);
        try
        {
            return resp.body;
        }
        catch (err)
        {
            if (resp.status === 201)
            {
                return '';
            }
            else if (resp.status === 403)
            {
                throw new Error('Access Denied');
            }
            else
            {
                throw err;
            }
        }
    }

    public async capsGetXML(capability: string | [string, Record<string, string>]): Promise<any>
    {
        let capName = '';
        let queryParams: Record<string, string> = {};
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

    public async capsGetString(capability: string | [string, Record<string, string>]): Promise<string>
    {
        let capName = '';
        let queryParams: Record<string, string> = {};
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
            return await this.capsPerformGet(capURL);
        }
        catch (error)
        {
            console.log('Error with cap ' + capName);
            console.log(error);
            throw error;
        }
    }

    public async capsPostXML(capability: string | [string, Record<string, string>], data: any): Promise<any>
    {
        let capName = '';
        let queryParams: Record<string, string> = {};
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

    public async capsPutXML(capability: string | [string, Record<string, string>], data: any): Promise<any>
    {
        let capName = '';
        let queryParams: Record<string, string> = {};
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

    public shutdown(): void
    {
        this.onGotSeedCap.complete();
        if (this.eventQueueClient)
        {
            void this.eventQueueClient.shutdown();
        }
        this.active = false;
    }

    public async waitForSeedCapability(): Promise<void>
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

    private async waitForCapTimeout(capName: string): Promise<void>
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
}
