"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const UUID_1 = require("../UUID");
const InstantMessageDialog_1 = require("../../enums/InstantMessageDialog");
const Utils_1 = require("../Utils");
const PacketFlags_1 = require("../../enums/PacketFlags");
const ImprovedInstantMessage_1 = require("../messages/ImprovedInstantMessage");
const Vector3_1 = require("../Vector3");
class GroupCommands extends CommandsBase_1.CommandsBase {
    sendGroupNotice(group, subject, message) {
        if (typeof group === 'string') {
            group = new UUID_1.UUID(group);
        }
        const circuit = this.circuit;
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: group,
            ParentEstateID: 0,
            RegionID: UUID_1.UUID.zero(),
            Position: Vector3_1.Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog_1.InstantMessageDialog.GroupNotice,
            ID: UUID_1.UUID.zero(),
            Timestamp: 0,
            FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
            Message: Utils_1.Utils.StringToBuffer(subject + '|' + message),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags_1.PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }
}
exports.GroupCommands = GroupCommands;
//# sourceMappingURL=GroupCommands.js.map