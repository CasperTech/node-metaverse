"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NetworkCommands_1 = require("./commands/NetworkCommands");
const AssetCommands_1 = require("./commands/AssetCommands");
const TeleportCommands_1 = require("./commands/TeleportCommands");
const RegionCommands_1 = require("./commands/RegionCommands");
const GridCommands_1 = require("./commands/GridCommands");
const CommunicationsCommands_1 = require("./commands/CommunicationsCommands");
const AgentCommands_1 = require("./commands/AgentCommands");
const GroupCommands_1 = require("./commands/GroupCommands");
class ClientCommands {
    constructor(region, agent, bot) {
        this.network = new NetworkCommands_1.NetworkCommands(region, agent, bot);
        this.asset = new AssetCommands_1.AssetCommands(region, agent, bot);
        this.teleport = new TeleportCommands_1.TeleportCommands(region, agent, bot);
        this.region = new RegionCommands_1.RegionCommands(region, agent, bot);
        this.grid = new GridCommands_1.GridCommands(region, agent, bot);
        this.comms = new CommunicationsCommands_1.CommunicationsCommands(region, agent, bot);
        this.agent = new AgentCommands_1.AgentCommands(region, agent, bot);
        this.group = new GroupCommands_1.GroupCommands(region, agent, bot);
    }
}
exports.ClientCommands = ClientCommands;
//# sourceMappingURL=ClientCommands.js.map