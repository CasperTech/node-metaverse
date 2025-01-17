import { Circuit } from './Circuit';
import type { Agent } from './Agent';
import { Caps } from './Caps';
import { Comms } from './Comms';
import type { ClientEvents } from './ClientEvents';
import type { IObjectStore } from './interfaces/IObjectStore';
import { ObjectStoreFull } from './ObjectStoreFull';
import { ObjectStoreLite } from './ObjectStoreLite';
import { RequestRegionInfoMessage } from './messages/RequestRegionInfo';
import type { RegionInfoMessage } from './messages/RegionInfo';
import { Message } from '../enums/Message';
import { Utils } from './Utils';
import type { RegionHandshakeMessage } from './messages/RegionHandshake';
import { MapNameRequestMessage } from './messages/MapNameRequest';
import { GridLayerType } from '../enums/GridLayerType';
import type { MapBlockReplyMessage } from './messages/MapBlockReply';
import { FilterResponse } from '../enums/FilterResponse';
import type * as Long from 'long';
import type { Packet } from './Packet';
import type { LayerDataMessage } from './messages/LayerData';
import { LayerType } from '../enums/LayerType';
import type { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { BitPack } from './BitPack';
import * as builder from 'xmlbuilder';
import { SimAccessFlags } from '../enums/SimAccessFlags';
import { ParcelDwellRequestMessage } from './messages/ParcelDwellRequest';
import type { ParcelDwellReplyMessage } from './messages/ParcelDwellReply';
import { Parcel } from './public/Parcel';
import type { ClientCommands } from './ClientCommands';
import type { SimulatorViewerTimeMessageMessage } from './messages/SimulatorViewerTimeMessage';
import type { ParcelOverlayMessage } from './messages/ParcelOverlay';
import type { ILandBlock } from './interfaces/ILandBlock';
import { LandFlags } from '../enums/LandFlags';
import { ParcelPropertiesRequestMessage } from './messages/ParcelPropertiesRequest';
import { UUID } from './UUID';
import { RegionFlags } from '../enums/RegionFlags';
import { BotOptionFlags } from '../enums/BotOptionFlags';
import type { ParcelPropertiesEvent } from '../events/ParcelPropertiesEvent';
import { PacketFlags } from '../enums/PacketFlags';
import { Vector3 } from './Vector3';
import { ObjectResolver } from './ObjectResolver';
import type { SimStatsMessage } from './messages/SimStats';
import { SimStatsEvent } from '../events/SimStatsEvent';
import { StatID } from '../enums/StatID';
import type { CoarseLocationUpdateMessage } from './messages/CoarseLocationUpdate';
import { Avatar } from './public/Avatar';
import type { MoneyBalanceReplyMessage } from './messages/MoneyBalanceReply';
import { BalanceUpdatedEvent } from '../events/BalanceUpdatedEvent';
import { Logger } from './Logger';
import { EconomyDataRequestMessage } from './messages/EconomyDataRequest';
import type { EconomyDataMessage } from './messages/EconomyData';
import { RegionEnvironment } from './public/RegionEnvironment';
import { LLSD } from './llsd/LLSD';

export class Region
{
    public static CopyMatrix16: number[] = [];
    public static CosineTable16: number[] = [];
    public static DequantizeTable16: number[] = [];
    public static setup = false;
    public static OO_SQRT_2 = 0.707106781186547;

    public regionName: string;
    public regionOwner: UUID;
    public regionID: UUID;
    public regionSizeX = 256;
    public regionSizeY = 256;
    public regionHandle: Long;
    public xCoordinate: number;
    public yCoordinate: number;
    public estateID: number;
    public parentEstateID: number;
    public regionFlags: RegionFlags;
    public mapImage: UUID;

    public simAccess: number;
    public maxAgents: number;
    public billableFactor: number;
    public objectBonusFactor: number;
    public waterHeight: number;
    public terrainRaiseLimit: number;
    public terrainLowerLimit: number;
    public pricePerMeter: number;
    public redirectGridX: number;
    public redirectGridY: number;
    public useEstateSun: boolean;
    public sunHour: number;
    public productSKU: string;
    public productName: string;
    public maxAgents32: number;
    public hardMaxAgents: number;
    public hardMaxObjects: number;
    public cacheID: UUID;
    public cpuClassID: number;
    public cpuRatio: number;
    public coloName: string;

    public terrainBase0: UUID;
    public terrainBase1: UUID;
    public terrainBase2: UUID;
    public terrainBase3: UUID;
    public terrainDetail0: UUID;
    public terrainDetail1: UUID;
    public terrainDetail2: UUID;
    public terrainDetail3: UUID;
    public terrainStartHeight00: number;
    public terrainStartHeight01: number;
    public terrainStartHeight10: number;
    public terrainStartHeight11: number;
    public terrainHeightRange00: number;
    public terrainHeightRange01: number;
    public terrainHeightRange10: number;
    public terrainHeightRange11: number;

    public handshakeComplete = false;
    public handshakeCompleteEvent: Subject<void> = new Subject<void>();

    public circuit: Circuit;
    public objects: IObjectStore;
    public caps: Caps;
    public comms: Comms;
    public clientEvents: ClientEvents;
    public clientCommands: ClientCommands;
    public options: BotOptionFlags;
    public agent: Agent;
    public messageSubscription: Subscription;
    public parcelPropertiesSubscription: Subscription;

    public terrain: number[][] = [];
    public tilesReceived = 0;
    public terrainComplete = false;
    public terrainCompleteEvent: Subject<void> = new Subject<void>();

    public parcelsComplete = false;
    public parcelsCompleteEvent: Subject<void> = new Subject<void>();

    public parcelOverlayComplete = false;
    public parcelOverlayCompleteEvent: Subject<void> = new Subject<void>();

    public parcelOverlay: ILandBlock[] = [];
    public parcels: Record<number, Parcel> = {};
    public parcelsByUUID: Record<string, Parcel> = {};
    public parcelMap: number[][] = [];

    public textures: {
        cloudTextureID?: UUID;
        sunTextureID?: UUID;
        moonTextureID?: UUID;
    } = {};


    public parcelCoordinates: { x: number, y: number }[] = [];

    public environment: RegionEnvironment;

    public timeOffset = 0;

    public resolver: ObjectResolver = new ObjectResolver(this);

    public agents = new Map<string, Avatar>();

    private uploadCost: number;

    private parcelOverlayReceived: Record<number, Buffer> = {};

    public constructor(agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
    {
        if (!Region.setup)
        {
            Region.InitialSetup();
        }
        for (let x = 0; x < 256; x++)
        {
            this.terrain.push([]);
            for (let y = 0; y < 256; y++)
            {
                this.terrain[x].push(-1);
            }
        }
        for (let x = 0; x < 64; x++)
        {
            this.parcelMap.push([]);
            for (let y = 0; y < 64; y++)
            {
                this.parcelMap[x].push(0);
            }
        }
        this.agent = agent;
        this.options = options;
        this.clientEvents = clientEvents;
        this.circuit = new Circuit();
        if (options & BotOptionFlags.LiteObjectStore)
        {
            this.objects = new ObjectStoreLite(this.circuit, agent, clientEvents, options);
        }
        else
        {
            this.objects = new ObjectStoreFull(this.circuit, agent, clientEvents, options);
        }
        this.comms = new Comms(this.circuit, agent, clientEvents);

        this.parcelPropertiesSubscription = this.clientEvents.onParcelPropertiesEvent.subscribe((parcelProperties: ParcelPropertiesEvent) =>
        {
            this.resolveParcel(parcelProperties).catch((_e: unknown) => {
                // ignore
            });
        });

        this.messageSubscription = this.circuit.subscribeToMessages([
            Message.ParcelOverlay,
            Message.LayerData,
            Message.SimulatorViewerTimeMessage,
            Message.SimStats,
            Message.CoarseLocationUpdate,
            Message.MoneyBalanceReply
        ], async(packet: Packet) =>
        {
            switch (packet.message.id)
            {
                case Message.MoneyBalanceReply:
                {
                    const msg = packet.message as MoneyBalanceReplyMessage;
                    const evt = new BalanceUpdatedEvent();
                    if (msg.TransactionInfo.Amount === -1)
                    {
                        // This is a requested balance update, so don't sent an event
                        return;
                    }
                    evt.balance = msg.MoneyData.MoneyBalance;
                    evt.transaction = {
                        type: msg.TransactionInfo.TransactionType,
                        amount: msg.TransactionInfo.Amount,
                        from: msg.TransactionInfo.SourceID,
                        to: msg.TransactionInfo.DestID,
                        success: msg.MoneyData.TransactionSuccess,
                        fromGroup: msg.TransactionInfo.IsSourceGroup,
                        toGroup: msg.TransactionInfo.IsDestGroup,
                        description: Utils.BufferToStringSimple(msg.TransactionInfo.ItemDescription)
                    }
                    this.clientEvents.onBalanceUpdated.next(evt);
                    break;
                }
                case Message.CoarseLocationUpdate:
                {
                    const locations: CoarseLocationUpdateMessage = packet.message as CoarseLocationUpdateMessage;
                    const foundAgents: Record<string, Vector3> = {};
                    for (let x = 0; x < locations.AgentData.length; x++)
                    {
                        const agentData = locations.AgentData[x];
                        const location = locations.Location[x];
                        const newPosition = new Vector3([location.X, location.Y, location.Z * 4]);
                        foundAgents[agentData.AgentID.toString()] = newPosition;

                        const foundAgent = this.agents.get(agentData.AgentID.toString());
                        if (foundAgent === undefined)
                        {
                            let resolved = await this.clientCommands.grid.avatarKey2Name(agentData.AgentID);
                            if (Array.isArray(resolved))
                            {
                                resolved = resolved[0];
                            }
                            const ag = new Avatar(agentData.AgentID, resolved.getFirstName(), resolved.getLastName());
                            ag.coarsePosition = newPosition;
                            this.agents.set(agentData.AgentID.toString(), ag);
                            this.clientEvents.onAvatarEnteredRegion.next(ag);
                        }
                        else
                        {
                            foundAgent.coarsePosition = newPosition;
                        }
                    }
                    const keys = this.agents.keys();
                    for (const agentID of keys)
                    {
                        if (foundAgents[agentID] === undefined)
                        {
                            const foundAgent = this.agents.get(agentID);
                            if (foundAgent !== undefined)
                            {
                                foundAgent.coarseLeftRegion();
                                this.agents.delete(agentID);
                            }
                        }
                    }
                    break;
                }
                case Message.SimStats:
                {
                    const stats: SimStatsMessage = packet.message as SimStatsMessage;
                    if (stats.Stat.length > 0)
                    {
                        const evt = new SimStatsEvent();
                        for (const pair of stats.Stat)
                        {
                            const value = pair.StatValue;
                            switch (pair.StatID)
                            {
                                case StatID.TimeDilation:
                                    evt.timeDilation = value;
                                    break;
                                case StatID.FPS:
                                    evt.fps = value;
                                    break;
                                case StatID.PhysFPS:
                                    evt.physFPS = value;
                                    break;
                                case StatID.AgentUPS:
                                    evt.agentUPS = value;
                                    break;
                                case StatID.FrameMS:
                                    evt.frameMS = value;
                                    break;
                                case StatID.NetMS:
                                    evt.netMS = value;
                                    break;
                                case StatID.SimOtherMS:
                                    evt.simOtherMS = value;
                                    break;
                                case StatID.SimPhysicsMS:
                                    evt.simPhysicsMS = value;
                                    break;
                                case StatID.AgentMS:
                                    evt.agentMS = value;
                                    break;
                                case StatID.ImagesMS:
                                    evt.imagesMS = value;
                                    break;
                                case StatID.ScriptMS:
                                    evt.scriptMS = value;
                                    break;
                                case StatID.NumTasks:
                                    evt.numTasks = value;
                                    break;
                                case StatID.NumTasksActive:
                                    evt.numTasksActive = value;
                                    break;
                                case StatID.NumAgentMain:
                                    evt.numAgentMain = value;
                                    break;
                                case StatID.NumAgentChild:
                                    evt.numAgentChild = value;
                                    break;
                                case StatID.NumScriptsActive:
                                    evt.numScriptsActive = value;
                                    break;
                                case StatID.LSLIPS:
                                    evt.lslIPS = value;
                                    break;
                                case StatID.InPPS:
                                    evt.inPPS = value;
                                    break;
                                case StatID.OutPPS:
                                    evt.outPPS = value;
                                    break;
                                case StatID.PendingDownloads:
                                    evt.pendingDownloads = value;
                                    break;
                                case StatID.PendingUploads:
                                    evt.pendingUploads = value;
                                    break;
                                case StatID.VirtualSizeKB:
                                    evt.virtualSizeKB = value;
                                    break;
                                case StatID.ResidentSizeKB:
                                    evt.residentSizeKB = value;
                                    break;
                                case StatID.PendingLocalUploads:
                                    evt.pendingLocalUploads = value;
                                    break;
                                case StatID.TotalUnackedBytes:
                                    evt.totalUnackedBytes = value;
                                    break;
                                case StatID.PhysicsPinnedTasks:
                                    evt.physicsPinnedTasks = value;
                                    break;
                                case StatID.PhysicsLODTasks:
                                    evt.physicsLODTasks = value;
                                    break;
                                case StatID.SimPhysicsStepMS:
                                    evt.simPhysicsStepMS = value;
                                    break;
                                case StatID.SimPhysicsShapeMS:
                                    evt.simPhysicsShapeMS = value;
                                    break;
                                case StatID.SimPhysicsOtherMS:
                                    evt.simPhysicsOtherMS = value;
                                    break;
                                case StatID.SimPhysicsMemory:
                                    evt.simPhysicsMemory = value;
                                    break;
                                case StatID.ScriptEPS:
                                    evt.scriptEPS = value;
                                    break;
                                case StatID.SimSpareTime:
                                    evt.simSpareTime = value;
                                    break;
                                case StatID.SimSleepTime:
                                    evt.simSleepTime = value;
                                    break;
                                case StatID.IOPumpTime:
                                    evt.ioPumpTime = value;
                                    break;
                                case StatID.PCTScriptsRun:
                                    evt.pctScriptsRun = value;
                                    break;
                                case StatID.RegionIdle:
                                    evt.regionIdle = value;
                                    break;
                                case StatID.RegionIdlePossible:
                                    evt.regionIdlePossible = value;
                                    break;
                                case StatID.SimAIStepTimeMS:
                                    evt.simAIStepTimeMS = value;
                                    break;
                                case StatID.SkippedAISilStepsPS:
                                    evt.skippedAISilStepsPS = value;
                                    break;
                                case StatID.PCTSteppedCharacters:
                                    evt.pctSteppedCharacters = value;
                                    break;
                            }
                            this.clientEvents.onSimStats.next(evt);
                        }
                    }
                    break;
                }
                case Message.ParcelOverlay:
                {
                    const parcelData: ParcelOverlayMessage = packet.message as ParcelOverlayMessage;
                    const sequence = parcelData.ParcelData.SequenceID;

                    if (this.parcelOverlayReceived[sequence] !== undefined)
                    {
                        this.parcelOverlayReceived = {};
                    }

                    this.parcelOverlayReceived[sequence] = parcelData.ParcelData.Data;
                    let totalLength = 0;
                    let highestSeq = 0;
                    for (const seq of Object.keys(this.parcelOverlayReceived))
                    {
                        const sequenceID: number = parseInt(seq, 10);
                        totalLength += this.parcelOverlayReceived[sequenceID].length;
                        if (sequenceID > highestSeq)
                        {
                            highestSeq = sequenceID;
                        }
                    }
                    if (totalLength !== (this.regionSizeX / 4) * (this.regionSizeY / 4))
                    {
                        // Overlay is incomplete
                        return;
                    }
                    for (let x = 0; x <= highestSeq; x++)
                    {
                        if (this.parcelOverlayReceived[x] === undefined)
                        {
                            // Overlay is incomplete
                            return;
                        }
                    }

                    this.parcelOverlay = [];
                    for (let seq = 0; seq <= highestSeq; seq++)
                    {
                        const data = this.parcelOverlayReceived[seq];
                        for (let x = 0; x < data.length; x++)
                        {
                            const block = data.readUInt8(x);
                            this.parcelOverlay.push({
                                landType: block & 0xF,
                                landFlags: block & ~0xF,
                                parcelID: -1
                            });
                        }
                    }

                    this.parcelCoordinates = [];
                    let currentParcelID = 0;
                    for (let y = 63; y > -1; y--)
                    {
                        for (let x = 63; x > -1; x--)
                        {
                            if (this.parcelOverlay[(y * 64) + x].parcelID === -1)
                            {
                                this.parcelCoordinates.push({ x, y });
                                currentParcelID++;
                                this.fillParcel(currentParcelID, x, y);
                            }
                        }
                    }

                    if (!this.parcelOverlayComplete)
                    {
                        this.parcelOverlayComplete = true;
                        this.parcelOverlayCompleteEvent.next();
                    }

                    this.parcelOverlayReceived = {};
                    break;
                }
                case Message.LayerData:
                {
                    const layerData: LayerDataMessage = packet.message as LayerDataMessage;
                    const type: LayerType = layerData.LayerID.Type;

                    const nibbler = new BitPack(layerData.LayerData.Data, 0);

                    // stride - unused for now
                    nibbler.UnpackBits(16);
                    const patchSize = nibbler.UnpackBits(8);
                    const headerLayerType: LayerType = nibbler.UnpackBits(8);

                    switch (type)
                    {
                        case LayerType.Land:
                        {
                            if (headerLayerType === type) // Quick sanity check
                            {
                                let x = 0;
                                let y = 0;
                                const patches: number[] = [];
                                for (let xi = 0; xi < 32 * 32; xi++)
                                {
                                    patches.push(0);
                                }

                                while (true)
                                {
                                    // DecodePatchHeader
                                    const quantWBits = nibbler.UnpackBits(8);
                                    if (quantWBits === 97)
                                    {
                                        break;
                                    }
                                    const dcOffset = nibbler.UnpackFloat();
                                    const range = nibbler.UnpackBits(16);
                                    const patchIDs = nibbler.UnpackBits(10);
                                    const wordBits = (quantWBits & 0x0f) + 2;

                                    x = patchIDs >> 5;
                                    y = patchIDs & 0x1F;
                                    if (x >= 16 || y >= 16)
                                    {
                                        console.error('Invalid land packet. x: ' + x + ', y: ' + y + ', patchSize: ' + patchSize);
                                        return;
                                    }
                                    else
                                    {
                                        // Decode patch
                                        let temp = 0;
                                        for (let n = 0; n < patchSize * patchSize; n++)
                                        {
                                            temp = nibbler.UnpackBits(1);
                                            if (temp !== 0)
                                            {
                                                temp = nibbler.UnpackBits(1);
                                                if (temp !== 0)
                                                {
                                                    temp = nibbler.UnpackBits(1);
                                                    if (temp !== 0)
                                                    {
                                                        // negative
                                                        temp = nibbler.UnpackBits(wordBits);
                                                        patches[n] = temp * -1;

                                                    }
                                                    else
                                                    {
                                                        // positive
                                                        temp = nibbler.UnpackBits(wordBits);
                                                        patches[n] = temp;
                                                    }
                                                }
                                                else
                                                {
                                                    for (let o = n; o < patchSize * patchSize; o++)
                                                    {
                                                        patches[o] = 0;
                                                    }
                                                    break;
                                                }
                                            }
                                            else
                                            {
                                                patches[n] = 0;
                                            }
                                        }

                                        // Decompress this patch
                                        const block: number[] = [];
                                        const output: number[] = [];

                                        const prequant = (quantWBits >> 4) + 2;
                                        const quantize = 1 << prequant;
                                        const ooq = 1.0 / quantize;
                                        const mult = ooq * range;
                                        const addVal = mult * (1 << (prequant - 1)) + dcOffset;

                                        if (patchSize === 16)
                                        {
                                            for (let n = 0; n < 16 * 16; n++)
                                            {
                                                block.push(patches[Region.CopyMatrix16[n]] * Region.DequantizeTable16[n])
                                            }

                                            const ftemp: number[] = [];
                                            for (let o = 0; o < 16 * 16; o++)
                                            {
                                                ftemp.push(o);
                                            }
                                            for (let o = 0; o < 16; o++)
                                            {
                                                Region.IDCTColumn16(block, ftemp, o);
                                            }
                                            for (let o = 0; o < 16; o++)
                                            {
                                                Region.IDCTLine16(ftemp, block, o);
                                            }
                                        }
                                        else
                                        {
                                            throw new Error('IDCTPatchLarge not implemented');
                                        }

                                        for (const bl of block)
                                        {
                                            output.push(bl * mult + addVal);
                                        }

                                        let outputIndex = 0;
                                        for (let yPoint = y * 16; yPoint < (y + 1) * 16; yPoint++)
                                        {
                                            for (let xPoint = x * 16; xPoint < (x + 1) * 16; xPoint++)
                                            {
                                                if (this.terrain[yPoint][xPoint] === -1)
                                                {
                                                    this.tilesReceived++;
                                                }
                                                this.terrain[yPoint][xPoint] = output[outputIndex++];
                                            }
                                        }

                                        if (this.tilesReceived === 65536)
                                        {
                                            this.terrainComplete = true;
                                            this.terrainCompleteEvent.next();
                                        }
                                    }
                                }
                            }
                            break;
                        }
                        default:
                            break;
                    }
                    break;
                }
                case Message.SimulatorViewerTimeMessage:
                {
                    const msg = packet.message as SimulatorViewerTimeMessageMessage;
                    const timeStamp = msg.TimeInfo.UsecSinceStart.toNumber() / 1000000;
                    this.timeOffset = (new Date().getTime() / 1000) - timeStamp;
                    break;
                }
                default:
                    break;
            }
        })
    }

    public static IDCTColumn16(linein: number[], lineout: number[], column: number): void
    {
        let total = 0;
        let usize = 0;

        for (let n = 0; n < 16; n++)
        {
            total = this.OO_SQRT_2 * linein[column];

            for (let u = 1; u < 16; u++)
            {
                usize = u * 16;
                total += linein[usize + column] * this.CosineTable16[usize + n];
            }

            lineout[16 * n + column] = total;
        }
    }

    public static IDCTLine16(linein: number[], lineout: number[], line: number): void
    {
        const oosob: number = 2.0 / 16.0;
        const lineSize: number = line * 16;
        let total = 0;

        for (let n = 0; n < 16; n++)
        {
            total = this.OO_SQRT_2 * linein[lineSize];

            for (let u = 1; u < 16; u++)
            {
                total += linein[lineSize + u] * this.CosineTable16[u * 16 + n];
            }

            lineout[lineSize + n] = total * oosob;
        }
    }

    public static InitialSetup(): void
    {
        // Build copy matrix 16
        {
            let diag = false;
            let right = true;
            let i = 0;
            let j = 0;
            let count = 0;

            for (let x = 0; x < 16 * 16; x++)
            {
                this.CopyMatrix16.push(0);
                this.DequantizeTable16.push(0);
                this.CosineTable16.push(0);
            }
            while (i < 16 && j < 16)
            {
                this.CopyMatrix16[j * 16 + i] = count++;

                if (!diag)
                {
                    if (right)
                    {
                        if (i < 16 - 1)
                        {
                            i++;
                        }
                        else
                        {
                            j++;
                        }

                        right = false;
                        diag = true;
                    }
                    else
                    {
                        if (j < 16 - 1)
                        {
                            j++;
                        }
                        else
                        {
                            i++;
                        }

                        right = true;
                        diag = true;
                    }
                }
                else
                {
                    if (right)
                    {
                        i++;
                        j--;
                        if (i === 16 - 1 || j === 0)
                        {
                            diag = false;
                        }
                    }
                    else
                    {
                        i--;
                        j++;
                        if (j === 16 - 1 || i === 0)
                        {
                            diag = false;
                        }
                    }
                }
            }
        }
        {
            for (let j = 0; j < 16; j++)
            {
                for (let i = 0; i < 16; i++)
                {
                    this.DequantizeTable16[j * 16 + i] = 1.0 + 2.0 * (i + j);
                }
            }
        }
        {
            const hposz: number = Math.PI * 0.5 / 16.0;

            for (let u = 0; u < 16; u++)
            {
                for (let n = 0; n < 16; n++)
                {
                    this.CosineTable16[u * 16 + n] = Math.cos((2.0 * n + 1.0) * u * hposz);
                }
            }
        }
        this.setup = true;
    }

    public async getUploadCost(): Promise<number>
    {
        if (this.uploadCost !== undefined)
        {
            return this.uploadCost;
        }

        const msg = new EconomyDataRequestMessage();
        this.circuit.sendMessage(msg, PacketFlags.Reliable);
        const economyReply = await this.circuit.waitForMessage<EconomyDataMessage>(Message.EconomyData, 10000, (_message: EconomyDataMessage): FilterResponse =>
        {
            return FilterResponse.Finish;
        });

        this.uploadCost = economyReply.Info.PriceUpload;
        return this.uploadCost;
    }

    public async getParcelProperties(x: number, y: number): Promise<Parcel>
    {
        return new Promise<Parcel>((resolve, reject) =>
        {
            const request = new ParcelPropertiesRequestMessage();
            request.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            request.ParcelData = {
                North: y + 1,
                East: x + 1,
                South: y,
                West: x,
                SequenceID: -10000,
                SnapSelection: false
            };
            this.circuit.sendMessage(request, PacketFlags.Reliable);
            let messageAwait: Subscription | undefined = undefined;
            let messageWaitTimer: number | undefined = undefined;

            messageAwait = this.clientEvents.onParcelPropertiesEvent.subscribe((parcelProperties: ParcelPropertiesEvent) =>
            {
                if (Region.doesBitmapContainCoordinate(parcelProperties.Bitmap, x, y))
                {
                    if (messageAwait !== undefined)
                    {
                        messageAwait.unsubscribe();
                        messageAwait = undefined;
                    }
                    if (messageWaitTimer !== undefined)
                    {
                        clearTimeout(messageWaitTimer);
                        messageWaitTimer = undefined;
                    }
                    this.resolveParcel(parcelProperties).then((value: Parcel) =>
                    {
                        resolve(value);
                    }).catch((e: unknown) =>
                    {
                        reject(e as Error);
                    })
                }
            });

            messageWaitTimer = setTimeout(() =>
            {
                if (messageAwait !== undefined)
                {
                    messageAwait.unsubscribe();
                    messageAwait = undefined;
                }
                if (messageWaitTimer !== undefined)
                {
                    clearTimeout(messageWaitTimer);
                    messageWaitTimer = undefined;
                }
                reject(new Error('Timed out'));
            }, 10000) as unknown as number;
        });
    }

    public async getParcels(): Promise<Parcel[]>
    {
        await this.waitForParcelOverlay();
        const parcels: Parcel[] = [];
        for (const parcel of this.parcelCoordinates)
        {
            try
            {
                parcels.push(await this.getParcelProperties(parcel.x * 4.0, parcel.y * 4.0));
            }
            catch (error)
            {
                console.error(error);
            }
        }
        return parcels;
    }

    public resetParcels(): void
    {
        this.parcelMap = [];
        for (let x = 0; x < 64; x++)
        {
            this.parcelMap.push([]);
            for (let y = 0; y < 64; y++)
            {
                this.parcelMap[x].push(0);
            }
        }
        this.parcels = {};
        this.parcelsByUUID = {};
        this.parcelsComplete = false;
    }

    public async waitForParcelOverlay(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.parcelOverlayComplete)
            {
                resolve();
            }
            else
            {
                let timeout: NodeJS.Timeout | null = null;
                const subscription = this.parcelOverlayCompleteEvent.subscribe(() =>
                {
                    if (timeout !== null)
                    {
                        clearTimeout(timeout);
                    }
                    subscription.unsubscribe();
                    resolve();
                });
                timeout = setTimeout(() =>
                {
                    subscription.unsubscribe();
                    reject(new Error('Timeout waiting for parcel overlay'));
                }, 10000);
            }
        });
    }

    public async waitForParcels(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.parcelsComplete)
            {
                resolve();
            }
            else
            {
                let timeout: NodeJS.Timeout | null = null;
                const subscription = this.parcelsCompleteEvent.subscribe(() =>
                {
                    if (timeout !== null)
                    {
                        clearTimeout(timeout);
                    }
                    subscription.unsubscribe();
                    resolve();
                });
                timeout = setTimeout(() =>
                {
                    subscription.unsubscribe();
                    reject(new Error('Timeout waiting for parcels'));
                }, 10000);
            }
        });
    }

    public async waitForTerrain(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.terrainComplete)
            {
                resolve();
            }
            else
            {
                let timeout: NodeJS.Timeout | null = null;
                const subscription = this.terrainCompleteEvent.subscribe(() =>
                {
                    if (timeout !== null)
                    {
                        clearTimeout(timeout);
                    }
                    subscription.unsubscribe();
                    resolve();
                });
                timeout = setTimeout(() =>
                {
                    subscription.unsubscribe();
                    reject(new Error('Timeout waiting for terrain'));
                }, 10000);
            }
        });
    }

    public getTerrainHeightAtPoint(x: number, y: number): number
    {
        const patchX = Math.floor(x / 16);
        const patchY = Math.floor(y / 16);
        x = x % 16;
        y = y % 16;

        const p = this.terrain[patchY * 16 + patchX];
        if (p === null)
        {
            return 0;
        }
        return p[y * 16 + x];
    }

    public exportXML(): string
    {
        const document = builder.create('RegionSettings');
        const general = document.ele('General');
        general.ele('AllowDamage', (this.regionFlags & RegionFlags.AllowDamage) ? 'True' : 'False');
        general.ele('AllowLandResell', !(this.regionFlags & RegionFlags.BlockLandResell) ? 'True' : 'False');
        general.ele('AllowLandJoinDivide', (this.regionFlags & RegionFlags.AllowParcelChanges) ? 'True' : 'False');
        general.ele('BlockFly', (this.regionFlags & RegionFlags.NoFly) ? 'True' : 'False');
        general.ele('BlockLandShowInSearch', (this.regionFlags & RegionFlags.BlockParcelSearch) ? 'True' : 'False');
        general.ele('BlockTerraform', (this.regionFlags & RegionFlags.BlockTerraform) ? 'True' : 'False');
        general.ele('DisableCollisions', (this.regionFlags & RegionFlags.SkipCollisions) ? 'True' : 'False');
        general.ele('DisablePhysics', (this.regionFlags & RegionFlags.SkipPhysics) ? 'True' : 'False');
        general.ele('DisableScripts', (this.regionFlags & RegionFlags.EstateSkipScripts) ? 'True' : 'False');
        general.ele('MaturityRating', (this.simAccess & SimAccessFlags.Mature & SimAccessFlags.Adult & SimAccessFlags.PG));
        general.ele('RestrictPushing', (this.regionFlags & RegionFlags.RestrictPushObject) ? 'True' : 'False');
        general.ele('AgentLimit', this.maxAgents);
        general.ele('ObjectBonus', this.objectBonusFactor);
        const groundTextures = document.ele('GroundTextures');
        groundTextures.ele('Texture1', this.terrainDetail0.toString());
        groundTextures.ele('Texture2', this.terrainDetail1.toString());
        groundTextures.ele('Texture3', this.terrainDetail2.toString());
        groundTextures.ele('Texture4', this.terrainDetail3.toString());

        groundTextures.ele('ElevationLowSW', this.terrainStartHeight00);
        groundTextures.ele('ElevationLowNW', this.terrainStartHeight01);
        groundTextures.ele('ElevationLowSE', this.terrainStartHeight10);
        groundTextures.ele('ElevationLowNE', this.terrainStartHeight11);

        groundTextures.ele('ElevationHighSW', this.terrainHeightRange00);
        groundTextures.ele('ElevationHighNW', this.terrainHeightRange01);
        groundTextures.ele('ElevationHighSE', this.terrainHeightRange10);
        groundTextures.ele('ElevationHighNE', this.terrainHeightRange11);

        const terrain = document.ele('Terrain');
        terrain.ele('WaterHeight', this.waterHeight);
        terrain.ele('TerrainRaiseLimit', this.terrainRaiseLimit);
        terrain.ele('TerrainLowerLimit', this.terrainLowerLimit);
        terrain.ele('UseEstateSun', (this.useEstateSun) ? 'True' : 'False');
        terrain.ele('FixedSun', (this.regionFlags & RegionFlags.SunFixed) ? 'True' : 'False');
        terrain.ele('SunPosition', this.sunHour);
        if (this.environment)
        {
            const env = document.ele('Environment');
            env.ele('data', this.environment.toNotation());
        }
        return document.end({ pretty: true, allowEmpty: true });
    }

    public activateCaps(seedURL: string): void
    {
        if (this.caps !== undefined)
        {
            this.caps.shutdown();
        }
        this.caps = new Caps(this.agent, seedURL, this.clientEvents);
    }

    public async handshake(handshake: RegionHandshakeMessage): Promise<void>
    {
        this.regionName = Utils.BufferToStringSimple(handshake.RegionInfo.SimName);
        this.simAccess = handshake.RegionInfo.SimAccess;
        this.regionFlags = handshake.RegionInfo.RegionFlags;
        this.regionOwner = handshake.RegionInfo.SimOwner;
        this.agent.setIsEstateManager(handshake.RegionInfo.IsEstateManager);
        this.waterHeight = handshake.RegionInfo.WaterHeight;
        this.billableFactor = handshake.RegionInfo.BillableFactor;
        this.cacheID = handshake.RegionInfo.CacheID;
        this.terrainBase0 = handshake.RegionInfo.TerrainBase0;
        this.terrainBase1 = handshake.RegionInfo.TerrainBase1;
        this.terrainBase2 = handshake.RegionInfo.TerrainBase2;
        this.terrainBase3 = handshake.RegionInfo.TerrainBase3;
        this.terrainDetail0 = handshake.RegionInfo.TerrainDetail0;
        this.terrainDetail1 = handshake.RegionInfo.TerrainDetail1;
        this.terrainDetail2 = handshake.RegionInfo.TerrainDetail2;
        this.terrainDetail3 = handshake.RegionInfo.TerrainDetail3;
        this.terrainStartHeight00 = handshake.RegionInfo.TerrainStartHeight00;
        this.terrainStartHeight01 = handshake.RegionInfo.TerrainStartHeight01;
        this.terrainStartHeight10 = handshake.RegionInfo.TerrainStartHeight10;
        this.terrainStartHeight11 = handshake.RegionInfo.TerrainStartHeight11;
        this.terrainHeightRange00 = handshake.RegionInfo.TerrainHeightRange00;
        this.terrainHeightRange01 = handshake.RegionInfo.TerrainHeightRange01;
        this.terrainHeightRange10 = handshake.RegionInfo.TerrainHeightRange10;
        this.terrainHeightRange11 = handshake.RegionInfo.TerrainHeightRange11;
        this.regionID = handshake.RegionInfo2.RegionID;
        this.cpuClassID = handshake.RegionInfo3.CPUClassID;
        this.cpuRatio = handshake.RegionInfo3.CPURatio;
        this.coloName = Utils.BufferToStringSimple(handshake.RegionInfo3.ColoName);
        this.productSKU = Utils.BufferToStringSimple(handshake.RegionInfo3.ProductSKU);
        this.productName = Utils.BufferToStringSimple(handshake.RegionInfo3.ProductName);


        const request: RequestRegionInfoMessage = new RequestRegionInfoMessage();
        request.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        this.circuit.sendMessage(request, PacketFlags.Reliable);
        const regionInfo: RegionInfoMessage = await this.circuit.waitForMessage<RegionInfoMessage>(Message.RegionInfo, 30000);

        this.estateID = regionInfo.RegionInfo.EstateID;
        this.parentEstateID = regionInfo.RegionInfo.ParentEstateID;
        this.maxAgents = regionInfo.RegionInfo.MaxAgents;
        this.objectBonusFactor = regionInfo.RegionInfo.ObjectBonusFactor;
        this.terrainRaiseLimit = regionInfo.RegionInfo.TerrainRaiseLimit;
        this.terrainLowerLimit = regionInfo.RegionInfo.TerrainLowerLimit;
        this.pricePerMeter = regionInfo.RegionInfo.PricePerMeter;
        this.redirectGridX = regionInfo.RegionInfo.RedirectGridX;
        this.redirectGridY = regionInfo.RegionInfo.RedirectGridY;
        this.useEstateSun = regionInfo.RegionInfo.UseEstateSun;
        this.sunHour = regionInfo.RegionInfo.SunHour;
        this.maxAgents32 = regionInfo.RegionInfo2.MaxAgents32;
        this.hardMaxAgents = regionInfo.RegionInfo2.HardMaxAgents;
        this.hardMaxObjects = regionInfo.RegionInfo2.HardMaxObjects;

        const msg: MapNameRequestMessage = new MapNameRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID,
            Flags: GridLayerType.Objects,
            EstateID: 0,
            Godlike: false
        };
        msg.NameData = {
            Name: handshake.RegionInfo.SimName
        };
        this.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.circuit.waitForMessage<MapBlockReplyMessage>(Message.MapBlockReply, 30000, (filterMsg: MapBlockReplyMessage): FilterResponse =>
        {
            for (const region of filterMsg.Data)
            {
                const name = Utils.BufferToStringSimple(region.Name);
                if (name.trim().toLowerCase() === this.regionName.trim().toLowerCase())
                {
                    this.xCoordinate = region.X;
                    this.yCoordinate = region.Y;
                    this.mapImage = region.MapImageID;
                    const globalPos = Utils.RegionCoordinatesToHandle(this.xCoordinate, this.yCoordinate);
                    this.regionHandle = globalPos.regionHandle;
                    return FilterResponse.Finish;
                }
            }
            return FilterResponse.NoMatch;
        });


        await this.caps.waitForSeedCapability();

        try
        {
            const extResponse = await this.caps.capsGetString('ExtEnvironment');
            this.environment = new RegionEnvironment(LLSD.parseXML(extResponse));
        }
        catch (e: unknown)
        {
            Logger.Error(e);
            Logger.Warn('Unable to get environment settings from region');
        }

        this.handshakeComplete = true;
        this.handshakeCompleteEvent.next();
    }

    public shutdown(): void
    {
        this.parcelPropertiesSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.comms.shutdown();
        this.caps.shutdown();
        this.objects.shutdown();
        this.resolver.shutdown();
        this.circuit.shutdown();
    }

    private static doesBitmapContainCoordinate(bitmap: Buffer, x: number, y: number): boolean
    {
        const mapBlockX = Math.floor(x / 4);
        const mapBlockY = Math.floor(y / 4);

        let index = (mapBlockY * 64) + mapBlockX;
        const bit = index % 8;
        index >>= 3;
        return ((bitmap[index] & (1 << bit)) !== 0);
    }

    private async resolveParcel(parcelProperties: ParcelPropertiesEvent): Promise<Parcel>
    {
        // Get the parcel UUID
        const msg = new ParcelDwellRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.Data = {
            LocalID: parcelProperties.LocalID,
            ParcelID: UUID.zero()
        };
        this.circuit.sendMessage(msg, PacketFlags.Reliable);
        const dwellReply = await this.circuit.waitForMessage<ParcelDwellReplyMessage>(Message.ParcelDwellReply, 10000, (message: ParcelDwellReplyMessage): FilterResponse =>
        {
            if (message.Data.LocalID === parcelProperties.LocalID)
            {
                return FilterResponse.Finish;
            }
            else
            {
                return FilterResponse.NoMatch;
            }
        });
        const parcelID: string = dwellReply.Data.ParcelID.toString();
        let parcel = new Parcel(this);
        if (this.parcelsByUUID[parcelID])
        {
            parcel = this.parcelsByUUID[parcelID];
        }
        parcel.LocalID = parcelProperties.LocalID;
        parcel.ParcelID = new UUID(dwellReply.Data.ParcelID.toString());
        parcel.RegionDenyAgeUnverified = parcelProperties.RegionDenyTransacted;
        parcel.MediaDesc = parcelProperties.MediaDesc;
        parcel.MediaHeight = parcelProperties.MediaHeight;
        parcel.MediaLoop = parcelProperties.MediaLoop;
        parcel.MediaType = parcelProperties.MediaType;
        parcel.MediaWidth = parcelProperties.MediaWidth;
        parcel.ObscureMedia = parcelProperties.ObscureMedia;
        parcel.ObscureMusic = parcelProperties.ObscureMusic;
        parcel.AABBMax = parcelProperties.AABBMax;
        parcel.AABBMin = parcelProperties.AABBMin;
        parcel.AnyAVSounds = parcelProperties.AnyAVSounds;
        parcel.Area = parcelProperties.Area;
        parcel.AuctionID = parcelProperties.AuctionID;
        parcel.AuthBuyerID = new UUID(parcelProperties.AuthBuyerID.toString());
        parcel.Bitmap = parcelProperties.Bitmap;
        parcel.Category = parcelProperties.Category;
        parcel.ClaimDate = parcelProperties.ClaimDate;
        parcel.ClaimPrice = parcelProperties.ClaimPrice;
        parcel.Desc = parcelProperties.Desc;
        parcel.Dwell = dwellReply.Data.Dwell;
        parcel.GroupAVSounds = parcelProperties.GroupAVSounds;
        parcel.GroupID = new UUID(parcelProperties.GroupID.toString());
        parcel.GroupPrims = parcelProperties.GroupPrims;
        parcel.IsGroupOwned = parcelProperties.IsGroupOwned;
        parcel.LandingType = parcelProperties.LandingType;
        parcel.MaxPrims = parcelProperties.MaxPrims;
        parcel.MediaAutoScale = parcelProperties.MediaAutoScale;
        parcel.MediaID = new UUID(parcelProperties.MediaID.toString());
        parcel.MediaURL = parcelProperties.MediaURL;
        parcel.MusicURL = parcelProperties.MusicURL;
        parcel.Name = parcelProperties.Name;
        parcel.OtherCleanTime = parcelProperties.OtherCleanTime;
        parcel.OtherCount = parcelProperties.OtherCount;
        parcel.OtherPrims = parcelProperties.OtherPrims;
        parcel.OwnerID = new UUID(parcelProperties.OwnerID.toString());
        parcel.OwnerPrims = parcelProperties.OwnerPrims;
        parcel.ParcelFlags = parcelProperties.ParcelFlags;
        parcel.ParcelPrimBonus = parcelProperties.ParcelPrimBonus;
        parcel.PassHours = parcelProperties.PassHours;
        parcel.PassPrice = parcelProperties.PassPrice;
        parcel.PublicCount = parcelProperties.PublicCount;
        parcel.RegionDenyAnonymous = parcelProperties.RegionDenyAnonymous;
        parcel.RegionDenyIdentified = parcelProperties.RegionDenyIdentified;
        parcel.RegionPushOverride = parcelProperties.RegionPushOverride;
        parcel.RegionDenyTransacted = parcelProperties.RegionDenyTransacted;
        parcel.RentPrice = parcelProperties.RentPrice;
        parcel.RequestResult = parcelProperties.RequestResult;
        parcel.SalePrice = parcelProperties.SalePrice;
        parcel.SeeAvs = parcelProperties.SeeAvs;
        parcel.SelectedPrims = parcelProperties.SelectedPrims;
        parcel.SelfCount = parcelProperties.SelfCount;
        parcel.SequenceID = parcelProperties.SequenceID;
        parcel.SimWideMaxPrims = parcelProperties.SimWideMaxPrims;
        parcel.SimWideTotalPrims = parcelProperties.SimWideTotalPrims;
        parcel.SnapSelection = parcelProperties.SnapSelection;
        parcel.SnapshotID = new UUID(parcelProperties.SnapshotID.toString());
        parcel.Status = parcelProperties.Status;
        parcel.TotalPrims = parcelProperties.TotalPrims;
        parcel.UserLocation = parcelProperties.UserLocation;
        parcel.UserLookAt = parcelProperties.UserLookAt;
        parcel.RegionAllowAccessOverride = parcelProperties.RegionAllowAccessOverride;
        this.parcels[parcelProperties.LocalID] = parcel;

        let foundEmpty = false;
        for (let y = 0; y < 64; y++)
        {
            for (let x = 0; x < 64; x++)
            {
                if (Region.doesBitmapContainCoordinate(parcel.Bitmap, x * 4, y * 4))
                {
                    this.parcelMap[y][x] = parcel.LocalID;
                }
                else
                {
                    if (this.parcelMap[y][x] === 0)
                    {
                        foundEmpty = true;
                    }
                }
            }
        }
        if (!foundEmpty)
        {
            if (!this.parcelsComplete)
            {
                this.parcelsComplete = true;
                this.parcelsCompleteEvent.next();
            }
        }
        else if (this.parcelsComplete)
        {
            this.parcelsComplete = false;
        }
        return parcel;
    }

    /* // This was useful for debugging, so leaving it here for the future
    private drawParcelMap()
    {
        console.log('====================================================');
        for (let y2 = 63; y2 > -1; y2--)
        {
            let row = '';
            for (let x2 = 0; x2 < 64; x2++)
            {
                const parcelID = this.parcelOverlay[(y2 * 64) + x2].parcelID;
                if (parcelID === -1)
                {
                    row += 'X';
                }
                else if (parcelID < 10)
                {
                    row += String(parcelID);
                }
                else
                {
                    row += '#';
                }
            }
            console.log(row);
        }
    }
     */

    private fillParcel(parcelID: number, x: number, y: number): void
    {
        if (x < 0 || y < 0 || x > 63 || y > 63)
        {
            return;
        }
        if (this.parcelOverlay[(y * 64) + x].parcelID !== -1)
        {
            return;
        }
        this.parcelOverlay[(y * 64) + x].parcelID = parcelID;
        const flags = this.parcelOverlay[(y * 64) + x].landFlags;
        if (!(flags & LandFlags.BorderSouth))
        {
            this.fillParcel(parcelID, x, y - 1);
        }
        if (!(flags & LandFlags.BorderWest))
        {
            this.fillParcel(parcelID, x - 1, y);
        }
        if (x < 63 && !(this.parcelOverlay[(y * 64) + (x + 1)].landFlags & LandFlags.BorderWest))
        {
            this.fillParcel(parcelID, x + 1, y);
        }
        if (y < 63 && !(this.parcelOverlay[((y + 1) * 64) + x].landFlags & LandFlags.BorderSouth))
        {
            this.fillParcel(parcelID, x, y + 1);
        }
    }
}
