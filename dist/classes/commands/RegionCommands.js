"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const RegionHandleRequest_1 = require("../messages/RegionHandleRequest");
const Message_1 = require("../../enums/Message");
const FilterResponse_1 = require("../../enums/FilterResponse");
const __1 = require("../..");
class RegionCommands extends CommandsBase_1.CommandsBase {
    getRegionHandle(regionID) {
        return new Promise((resolve, reject) => {
            const circuit = this.currentRegion.circuit;
            const msg = new RegionHandleRequest_1.RegionHandleRequestMessage();
            msg.RequestBlock = {
                RegionID: regionID,
            };
            circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            circuit.waitForMessage(Message_1.Message.RegionIDAndHandleReply, 10000, (filterMsg) => {
                if (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString()) {
                    return FilterResponse_1.FilterResponse.Finish;
                }
                else {
                    return FilterResponse_1.FilterResponse.NoMatch;
                }
            }).then((responseMsg) => {
                resolve(responseMsg.ReplyBlock.RegionHandle);
            });
        });
    }
    getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ) {
        return this.currentRegion.objects.getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ);
    }
}
exports.RegionCommands = RegionCommands;
//# sourceMappingURL=RegionCommands.js.map