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
const CommandsBase_1 = require("./CommandsBase");
const ParcelInfoRequest_1 = require("../messages/ParcelInfoRequest");
const UUID_1 = require("../UUID");
const Message_1 = require("../../enums/Message");
const FilterResponse_1 = require("../../enums/FilterResponse");
const Utils_1 = require("../Utils");
const __1 = require("../..");
class ParcelCommands extends CommandsBase_1.CommandsBase {
    getParcelInfo(parcelID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof parcelID === 'string') {
                parcelID = new UUID_1.UUID(parcelID);
            }
            const msg = new ParcelInfoRequest_1.ParcelInfoRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            msg.Data = {
                ParcelID: parcelID
            };
            this.circuit.sendMessage(msg, __1.PacketFlags.Reliable);
            const parcelInfoReply = (yield this.circuit.waitForMessage(Message_1.Message.ParcelInfoReply, 10000, (replyMessage) => {
                if (replyMessage.Data.ParcelID.equals(parcelID)) {
                    return FilterResponse_1.FilterResponse.Finish;
                }
                return FilterResponse_1.FilterResponse.NoMatch;
            }));
            return new class {
                constructor() {
                    this.OwnerID = parcelInfoReply.Data.OwnerID;
                    this.ParcelName = Utils_1.Utils.BufferToStringSimple(parcelInfoReply.Data.Name);
                    this.ParcelDescription = Utils_1.Utils.BufferToStringSimple(parcelInfoReply.Data.Desc);
                    this.Area = parcelInfoReply.Data.ActualArea;
                    this.BillableArea = parcelInfoReply.Data.BillableArea;
                    this.Flags = parcelInfoReply.Data.Flags;
                    this.GlobalCoordinates = new __1.Vector3([parcelInfoReply.Data.GlobalX, parcelInfoReply.Data.GlobalY, parcelInfoReply.Data.GlobalZ]);
                    this.RegionName = Utils_1.Utils.BufferToStringSimple(parcelInfoReply.Data.SimName);
                    this.SnapshotID = parcelInfoReply.Data.SnapshotID;
                    this.Traffic = parcelInfoReply.Data.Dwell;
                    this.SalePrice = parcelInfoReply.Data.SalePrice;
                    this.AuctionID = parcelInfoReply.Data.AuctionID;
                }
            };
        });
    }
}
exports.ParcelCommands = ParcelCommands;
//# sourceMappingURL=ParcelCommands.js.map