"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Circuit_1 = require("./Circuit");
const Caps_1 = require("./Caps");
const Comms_1 = require("./Comms");
const ObjectStoreFull_1 = require("./ObjectStoreFull");
const ObjectStoreLite_1 = require("./ObjectStoreLite");
const __1 = require("..");
const RequestRegionInfo_1 = require("./messages/RequestRegionInfo");
const Message_1 = require("../enums/Message");
const Utils_1 = require("./Utils");
const MapNameRequest_1 = require("./messages/MapNameRequest");
const GridLayerType_1 = require("../enums/GridLayerType");
const FilterResponse_1 = require("../enums/FilterResponse");
class Region {
    constructor(agent, clientEvents, options) {
        this.agent = agent;
        this.options = options;
        this.clientEvents = clientEvents;
        this.circuit = new Circuit_1.Circuit(clientEvents);
        if (options & __1.BotOptionFlags.LiteObjectStore) {
            this.objects = new ObjectStoreLite_1.ObjectStoreLite(this.circuit, agent, clientEvents, options);
        }
        else {
            this.objects = new ObjectStoreFull_1.ObjectStoreFull(this.circuit, agent, clientEvents, options);
        }
        this.comms = new Comms_1.Comms(this.circuit, agent, clientEvents);
    }
    activateCaps(seedURL) {
        this.caps = new Caps_1.Caps(this.agent, this, seedURL, this.clientEvents);
    }
    handshake(handshake) {
        return __awaiter(this, void 0, void 0, function* () {
            this.regionName = Utils_1.Utils.BufferToStringSimple(handshake.RegionInfo.SimName);
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
            this.coloName = Utils_1.Utils.BufferToStringSimple(handshake.RegionInfo3.ColoName);
            this.productSKU = Utils_1.Utils.BufferToStringSimple(handshake.RegionInfo3.ProductSKU);
            this.productName = Utils_1.Utils.BufferToStringSimple(handshake.RegionInfo3.ProductName);
            const request = new RequestRegionInfo_1.RequestRegionInfoMessage();
            request.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            this.circuit.sendMessage(request, __1.PacketFlags.Reliable);
            const regionInfo = yield this.circuit.waitForMessage(Message_1.Message.RegionInfo, 10000);
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
            const msg = new MapNameRequest_1.MapNameRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID,
                Flags: GridLayerType_1.GridLayerType.Objects,
                EstateID: 0,
                Godlike: false
            };
            msg.NameData = {
                Name: handshake.RegionInfo.SimName
            };
            this.circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            const reply = yield this.circuit.waitForMessage(Message_1.Message.MapBlockReply, 10000, (filterMsg) => {
                for (const region of filterMsg.Data) {
                    const name = Utils_1.Utils.BufferToStringSimple(region.Name);
                    if (name.trim().toLowerCase() === this.regionName.trim().toLowerCase()) {
                        this.xCoordinate = region.X;
                        this.yCoordinate = region.Y;
                        this.mapImage = region.MapImageID;
                        this.regionHandle = Utils_1.Utils.RegionCoordinatesToHandle(this.xCoordinate, this.yCoordinate);
                        return FilterResponse_1.FilterResponse.Finish;
                    }
                }
                return FilterResponse_1.FilterResponse.NoMatch;
            });
        });
    }
    shutdown() {
        this.comms.shutdown();
        this.caps.shutdown();
        this.objects.shutdown();
        this.circuit.shutdown();
    }
}
exports.Region = Region;
//# sourceMappingURL=Region.js.map