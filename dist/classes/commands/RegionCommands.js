"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const PacketFlags_1 = require("../../enums/PacketFlags");
const RegionHandleRequest_1 = require("../messages/RegionHandleRequest");
const Message_1 = require("../../enums/Message");
const FilterResponse_1 = require("../../enums/FilterResponse");
class RegionCommands extends CommandsBase_1.CommandsBase {
    getRegionHandle(regionID) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const msg = new RegionHandleRequest_1.RegionHandleRequestMessage();
            msg.RequestBlock = {
                RegionID: regionID,
            };
            circuit.sendMessage(msg, PacketFlags_1.PacketFlags.Reliable);
            circuit.waitForMessage(Message_1.Message.RegionIDAndHandleReply, 10000, (packet) => {
                const filterMsg = packet.message;
                if (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString()) {
                    return FilterResponse_1.FilterResponse.Finish;
                }
                else {
                    return FilterResponse_1.FilterResponse.NoMatch;
                }
            }).then((packet) => {
                const responseMsg = packet.message;
                resolve(responseMsg.ReplyBlock.RegionHandle);
            });
        });
    }
}
exports.RegionCommands = RegionCommands;
//# sourceMappingURL=RegionCommands.js.map