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
const __1 = require("../..");
const InstantMessageDialog_1 = require("../../enums/InstantMessageDialog");
const ImprovedInstantMessage_1 = require("../messages/ImprovedInstantMessage");
const Utils_1 = require("../Utils");
class InventoryCommands extends CommandsBase_1.CommandsBase {
    getInventoryRoot() {
        return this.agent.inventory.getRootFolderMain();
    }
    getLibraryRoot() {
        return this.agent.inventory.getRootFolderLibrary();
    }
    respondToInventoryOffer(event, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const agentName = this.agent.firstName + ' ' + this.agent.lastName;
            const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
            const folder = this.agent.inventory.findFolderForType(event.type);
            const binary = Buffer.allocUnsafe(16);
            folder.writeToBuffer(binary, 0);
            im.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            im.MessageBlock = {
                FromGroup: false,
                ToAgentID: event.from,
                ParentEstateID: 0,
                RegionID: __1.UUID.zero(),
                Position: __1.Vector3.getZero(),
                Offline: 0,
                Dialog: response,
                ID: event.requestID,
                Timestamp: Math.floor(new Date().getTime() / 1000),
                FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
                Message: Utils_1.Utils.StringToBuffer(''),
                BinaryBucket: binary
            };
            im.EstateBlock = {
                EstateID: 0
            };
            const sequenceNo = this.circuit.sendMessage(im, __1.PacketFlags.Reliable);
            return yield this.circuit.waitForAck(sequenceNo, 10000);
        });
    }
    acceptInventoryOffer(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.source === __1.ChatSourceType.Object) {
                return yield this.respondToInventoryOffer(event, InstantMessageDialog_1.InstantMessageDialog.TaskInventoryAccepted);
            }
            else {
                return yield this.respondToInventoryOffer(event, InstantMessageDialog_1.InstantMessageDialog.InventoryAccepted);
            }
        });
    }
    rejectInventoryOffer(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.source === __1.ChatSourceType.Object) {
                return yield this.respondToInventoryOffer(event, InstantMessageDialog_1.InstantMessageDialog.TaskInventoryDeclined);
            }
            else {
                return yield this.respondToInventoryOffer(event, InstantMessageDialog_1.InstantMessageDialog.InventoryDeclined);
            }
        });
    }
}
exports.InventoryCommands = InventoryCommands;
//# sourceMappingURL=InventoryCommands.js.map