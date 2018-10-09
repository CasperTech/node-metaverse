import {Circuit} from './Circuit';
import {Agent} from './Agent';
import {Caps} from './Caps';
import {Comms} from './Comms';
import {ClientEvents} from './ClientEvents';
import {IObjectStore} from './interfaces/IObjectStore';
import {ObjectStoreFull} from './ObjectStoreFull';
import {ObjectStoreLite} from './ObjectStoreLite';
import {BotOptionFlags, PacketFlags, UUID} from '..';
import {RequestRegionInfoMessage} from './messages/RequestRegionInfo';
import {RegionInfoMessage} from './messages/RegionInfo';
import {Message} from '../enums/Message';
import {Utils} from './Utils';
import {RegionFlags} from '../enums/RegionFlags';
import {RegionHandshakeMessage} from './messages/RegionHandshake';
import {MapNameRequestMessage} from './messages/MapNameRequest';
import {GridLayerType} from '../enums/GridLayerType';
import {MapBlockReplyMessage} from './messages/MapBlockReply';
import {FilterResponse} from '../enums/FilterResponse';
import * as Long from 'long';

export class Region
{
    regionName: string;
    regionOwner: UUID;
    regionID: UUID;
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

    circuit: Circuit;
    objects: IObjectStore;
    caps: Caps;
    comms: Comms;
    clientEvents: ClientEvents;
    options: BotOptionFlags;
    agent: Agent;

    constructor(agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
    {
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
                    this.regionHandle = Utils.RegionCoordinatesToHandle(this.xCoordinate, this.yCoordinate);
                    return FilterResponse.Finish;
                }
            }
            return FilterResponse.NoMatch;
        });
    }
    shutdown()
    {
        this.comms.shutdown();
        this.caps.shutdown();
        this.objects.shutdown();
        this.circuit.shutdown();

    }
}
