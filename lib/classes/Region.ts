import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { Caps } from './Caps';
import { Comms } from './Comms';
import { ClientEvents } from './ClientEvents';
import { IObjectStore } from './interfaces/IObjectStore';
import { ObjectStoreFull } from './ObjectStoreFull';
import { ObjectStoreLite } from './ObjectStoreLite';
import { RequestRegionInfoMessage } from './messages/RequestRegionInfo';
import { RegionInfoMessage } from './messages/RegionInfo';
import { Message } from '../enums/Message';
import { Utils } from './Utils';
import { RegionHandshakeMessage } from './messages/RegionHandshake';
import { MapNameRequestMessage } from './messages/MapNameRequest';
import { GridLayerType } from '../enums/GridLayerType';
import { MapBlockReplyMessage } from './messages/MapBlockReply';
import { FilterResponse } from '../enums/FilterResponse';
import * as Long from 'long';
import { Packet } from './Packet';
import { LayerDataMessage } from './messages/LayerData';
import { LayerType } from '../enums/LayerType';
import { Subscription } from 'rxjs/internal/Subscription';
import { BitPack } from './BitPack';
import * as builder from 'xmlbuilder';
import { SimAccessFlags } from '../enums/SimAccessFlags';
import { Subject } from 'rxjs/internal/Subject';
import { ParcelDwellRequestMessage } from './messages/ParcelDwellRequest';
import { ParcelDwellReplyMessage } from './messages/ParcelDwellReply';
import { Parcel } from './public/Parcel';
import { RegionEnvironment } from './public/RegionEnvironment';
import { Color4 } from './Color4';
import { SkyPreset } from './public/interfaces/SkyPreset';
import { Vector4 } from './Vector4';
import { WaterPreset } from './public/interfaces/WaterPreset';
import { ClientCommands } from './ClientCommands';
import { SimulatorViewerTimeMessageMessage } from './messages/SimulatorViewerTimeMessage';
import { ParcelOverlayMessage } from './messages/ParcelOverlay';
import { ILandBlock } from './interfaces/ILandBlock';
import { LandFlags } from '../enums/LandFlags';
import { ParcelPropertiesRequestMessage } from './messages/ParcelPropertiesRequest';
import Timer = NodeJS.Timer;
import { UUID } from './UUID';
import { RegionFlags } from '../enums/RegionFlags';
import { BotOptionFlags } from '../enums/BotOptionFlags';
import { ParcelPropertiesEvent } from '../events/ParcelPropertiesEvent';
import { PacketFlags } from '../enums/PacketFlags';
import { Vector3 } from './Vector3';
import { Vector2 } from './Vector2';

export class Region
{
    static CopyMatrix16: number[] = [];
    static CosineTable16: number[] = [];
    static DequantizeTable16: number[] = [];
    static setup = false;
    static OO_SQRT_2 = 0.7071067811865475244008443621049;

    regionName: string;
    regionOwner: UUID;
    regionID: UUID;
    regionSizeX = 256;
    regionSizeY = 256;
    regionHandle: Long;
    xCoordinate: number;
    yCoordinate: number;
    estateID: number;
    parentEstateID: number;
    regionFlags: RegionFlags;
    mapImage: UUID;

    simAccess: number;
    maxAgents: number;
    billableFactor: number;
    objectBonusFactor: number;
    waterHeight: number;
    terrainRaiseLimit: number;
    terrainLowerLimit: number;
    pricePerMeter: number;
    redirectGridX: number;
    redirectGridY: number;
    useEstateSun: boolean;
    sunHour: number;
    productSKU: string;
    productName: string;
    maxAgents32: number;
    hardMaxAgents: number;
    hardMaxObjects: number;
    cacheID: UUID;
    cpuClassID: number;
    cpuRatio: number;
    coloName: string;

    terrainBase0: UUID;
    terrainBase1: UUID;
    terrainBase2: UUID;
    terrainBase3: UUID;
    terrainDetail0: UUID;
    terrainDetail1: UUID;
    terrainDetail2: UUID;
    terrainDetail3: UUID;
    terrainStartHeight00: number;
    terrainStartHeight01: number;
    terrainStartHeight10: number;
    terrainStartHeight11: number;
    terrainHeightRange00: number;
    terrainHeightRange01: number;
    terrainHeightRange10: number;
    terrainHeightRange11: number;

    handshakeComplete = false;
    handshakeCompleteEvent: Subject<void> = new Subject<void>();

    circuit: Circuit;
    objects: IObjectStore;
    caps: Caps;
    comms: Comms;
    clientEvents: ClientEvents;
    clientCommands: ClientCommands;
    options: BotOptionFlags;
    agent: Agent;
    messageSubscription: Subscription;
    parcelPropertiesSubscription: Subscription;

    terrain: number[][] = [];
    tilesReceived = 0;
    terrainComplete = false;
    terrainCompleteEvent: Subject<void> = new Subject<void>();

    parcelsComplete = false;
    parcelsCompleteEvent: Subject<void> = new Subject<void>();

    parcelOverlayComplete = false;
    parcelOverlayCompleteEvent: Subject<void> = new Subject<void>();

    parcelOverlay: ILandBlock[] = [];
    parcels: {[key: number]: Parcel} = {};
    parcelsByUUID: {[key: string]: Parcel} = {};
    parcelMap: number[][] = [];


    parcelCoordinates: {x: number, y: number}[] = [];

    environment: RegionEnvironment;

    timeOffset = 0;

    private parcelOverlayReceived: {[key: number]: Buffer} = {};

    static IDCTColumn16(linein: number[], lineout: number[], column: number)
    {
        let total: number;
        let usize: number;

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

    static IDCTLine16(linein: number[], lineout: number[], line: number)
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

    static InitialSetup()
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

    private static doesBitmapContainCoordinate(bitmap: Buffer, x: number, y: number): boolean
    {
        const mapBlockX = Math.floor(x / 4);
        const mapBlockY = Math.floor(y / 4);

        let index = (mapBlockY * 64) + mapBlockX;
        const bit = index % 8;
        index >>= 3;
        return ((bitmap[index] & (1 << bit)) !== 0);
    }

    constructor(agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
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
        this.circuit = new Circuit(clientEvents);
        if (options & BotOptionFlags.LiteObjectStore)
        {
            this.objects = new ObjectStoreLite(this.circuit, agent, clientEvents, options);
        }
        else
        {
            this.objects = new ObjectStoreFull(this.circuit, agent, clientEvents, options);
        }
        this.comms = new Comms(this.circuit, agent, clientEvents);

        this.parcelPropertiesSubscription = this.clientEvents.onParcelPropertiesEvent.subscribe(async (parcelProperties: ParcelPropertiesEvent) =>
        {
            await this.resolveParcel(parcelProperties);
        });

        this.messageSubscription = this.circuit.subscribeToMessages([
            Message.ParcelOverlay,
            Message.LayerData,
            Message.SimulatorViewerTimeMessage
        ], (packet: Packet) =>
        {
            switch (packet.message.id)
            {
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
                                landFlags: block & ~ 0xF,
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
                                this.parcelCoordinates.push({x, y});
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

                    const stride = nibbler.UnpackBits(16);
                    const patchSize = nibbler.UnpackBits(8);
                    const headerLayerType = nibbler.UnpackBits(8);

                    switch (type)
                    {
                        case LayerType.Land:
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

                                        for (let j = 0; j < block.length; j++)
                                        {
                                            output.push(block[j] * mult + addVal);
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
                    break;
                }
                case Message.SimulatorViewerTimeMessage:
                {
                    const msg = packet.message as SimulatorViewerTimeMessageMessage;
                    const timeStamp = msg.TimeInfo.UsecSinceStart.toNumber() / 1000000;
                    this.timeOffset = (new Date().getTime() / 1000) - timeStamp;
                    break;
                }
            }
        })
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
        let parcel = new Parcel();
        if (this.parcelsByUUID[parcelID])
        {
            parcel = this.parcelsByUUID[parcelID];
        }
        parcel.LocalID = parcelProperties.LocalID;
        parcel.ParcelID = dwellReply.Data.ParcelID;
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
        parcel.AuthBuyerID = parcelProperties.AuthBuyerID;
        parcel.Bitmap = parcelProperties.Bitmap;
        parcel.Category = parcelProperties.Category;
        parcel.ClaimDate = parcelProperties.ClaimDate;
        parcel.ClaimPrice = parcelProperties.ClaimPrice;
        parcel.Desc = parcelProperties.Desc;
        parcel.Dwell = dwellReply.Data.Dwell;
        parcel.GroupAVSounds = parcelProperties.GroupAVSounds;
        parcel.GroupID = parcelProperties.GroupID;
        parcel.GroupPrims = parcelProperties.GroupPrims;
        parcel.IsGroupOwned = parcelProperties.IsGroupOwned;
        parcel.LandingType = parcelProperties.LandingType;
        parcel.MaxPrims = parcelProperties.MaxPrims;
        parcel.MediaAutoScale = parcelProperties.MediaAutoScale;
        parcel.MediaID = parcelProperties.MediaID;
        parcel.MediaURL = parcelProperties.MediaURL;
        parcel.MusicURL = parcelProperties.MusicURL;
        parcel.Name = parcelProperties.Name;
        parcel.OtherCleanTime = parcelProperties.OtherCleanTime;
        parcel.OtherCount = parcelProperties.OtherCount;
        parcel.OtherPrims = parcelProperties.OtherPrims;
        parcel.OwnerID = parcelProperties.OwnerID;
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
        parcel.SnapshotID = parcelProperties.SnapshotID;
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

    private fillParcel(parcelID: number, x: number, y: number)
    {
        if ( x < 0 || y < 0 || x > 63 || y > 63)
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

    public getParcelProperties(x: number, y: number): Promise<Parcel>
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

            messageAwait = this.clientEvents.onParcelPropertiesEvent.subscribe(async (parcelProperties: ParcelPropertiesEvent) =>
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
                    resolve(await this.resolveParcel(parcelProperties));
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
            }, 10000) as any as number;
        });
    }

    async getParcels(): Promise<Parcel[]>
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

    resetParcels(): void
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

    waitForParcelOverlay(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.parcelOverlayComplete)
            {
                resolve();
            }
            else
            {
                let timeout: Timer | null = null;
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

    waitForParcels(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.parcelsComplete)
            {
                resolve();
            }
            else
            {
                let timeout: Timer | null = null;
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

    waitForTerrain(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.terrainComplete)
            {
                resolve();
            }
            else
            {
                let timeout: Timer | null = null;
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

    getTerrainHeightAtPoint(x: number, y: number): number
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

    exportXML(): string
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
        this.environment.getXML(document);
        return document.end({pretty: true, allowEmpty: true});
    }

    activateCaps(seedURL: string)
    {
        this.caps = new Caps(this.agent, this, seedURL, this.clientEvents);
    }
    async handshake(handshake: RegionHandshakeMessage)
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
        const regionInfo: RegionInfoMessage = await this.circuit.waitForMessage<RegionInfoMessage>(Message.RegionInfo, 10000);

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
        const reply: MapBlockReplyMessage = await this.circuit.waitForMessage<MapBlockReplyMessage>(Message.MapBlockReply, 10000, (filterMsg: MapBlockReplyMessage): FilterResponse =>
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

        this.environment = new RegionEnvironment();
        this.environment.dayCycleKeyframes = [];
        this.environment.skyPresets = {};
        this.environment.water = {
            blurMultiplier: 0,
            fresnelOffset: 0,
            fresnelScale: 0,
            normalScale: Vector3.getZero(),
            normalMap: UUID.zero(),
            scaleAbove: 0,
            scaleBelow: 0,
            underWaterFogMod: 0,
            waterFogColor: Color4.white,
            waterFogDensity: 0,
            wave1Dir: Vector2.getZero(),
            wave2Dir: Vector2.getZero()
        };

        await this.caps.waitForSeedCapability();
        const response = await this.caps.capsGetXML('EnvironmentSettings');
        if (response.length >= 4)
        {
            if (Array.isArray(response[1]) && typeof response[2] === 'object' && typeof response[3] === 'object')
            {
                for (const kf of response[1])
                {
                    this.environment.dayCycleKeyframes.push({
                        time: kf[0],
                        preset: kf[1]
                    });
                }
                for (const presetKey of Object.keys(response[2]))
                {
                    const preset = response[2][presetKey];
                    this.environment.skyPresets[presetKey] = new class implements SkyPreset
                    {
                        ambient = new Vector4(preset['ambient']);
                        blueDensity = new Vector4(preset['blue_density']);
                        blueHorizon = new Vector4(preset['blue_horizon']);
                        cloudColor = new Color4(preset['cloud_color']);
                        cloudPosDensity1 = new Vector4(preset['cloud_pos_density1']);
                        cloudPosDensity2 = new Vector4(preset['cloud_pos_density2']);
                        cloudScale = new Vector4(preset['cloud_scale']);
                        cloudScrollRate = new Vector2(preset['cloud_scroll_rate']);
                        cloudShadow = new Vector4(preset['cloud_shadow']);
                        densityMultiplier = new Vector4(preset['density_multiplier']);
                        distanceMultiplier = new Vector4(preset['distance_multiplier']);
                        eastAngle = preset['east_angle'];
                        enableCloudScroll = {
                            x: preset['enable_cloud_scroll'][0],
                            y: preset['enable_cloud_scroll'][1]
                        };
                        gamma = new Vector4(preset['gamma']);
                        glow = new Vector4(preset['glow']);
                        hazeDensity = new Vector4(preset['haze_density']);
                        hazeHorizon = new Vector4(preset['haze_horizon']);
                        lightNormal = new Vector4(preset['lightnorm']);
                        maxY = new Vector4(preset['max_y']);
                        starBrightness = preset['start_brightness'];
                        sunAngle = preset['sun_angle'];
                        sunlightColor = new Color4(preset['sunlight_color']);
                    };
                }
                const wat = response[3];
                this.environment.water = new class implements WaterPreset
                {
                    blurMultiplier = wat['blurMultiplier'];
                    fresnelOffset = wat['fresnelOffset'];
                    fresnelScale = wat['fresnelScale'];
                    normalScale = new Vector3(wat['normScale']);
                    normalMap = new UUID(wat['normalMap'].toString());
                    scaleAbove = wat['scaleAbove'];
                    scaleBelow = wat['scaleBelow'];
                    underWaterFogMod = wat['underWaterFogMod'];
                    waterFogColor = new Color4(wat['waterFogColor']);
                    waterFogDensity = wat['waterFogDensity'];
                    wave1Dir = new Vector2(wat['wave1Dir']);
                    wave2Dir = new Vector2(wat['wave2Dir']);
                };
            }
        }
        this.handshakeComplete = true;
        this.handshakeCompleteEvent.next();
    }
    shutdown()
    {
        this.parcelPropertiesSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.comms.shutdown();
        this.caps.shutdown();
        this.objects.shutdown();
        this.circuit.shutdown();

    }
}
