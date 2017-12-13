"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UpdateSimulatorMessage {
    constructor() {
        this.name = 'UpdateSimulator';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UpdateSimulator;
    }
    getSize() {
        return (this.SimulatorInfo['SimName'].length + 1) + 21;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.SimulatorInfo['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.SimulatorInfo['SimName'].length, pos++);
        this.SimulatorInfo['SimName'].copy(buf, pos);
        pos += this.SimulatorInfo['SimName'].length;
        buf.writeUInt32LE(this.SimulatorInfo['EstateID'], pos);
        pos += 4;
        buf.writeUInt8(this.SimulatorInfo['SimAccess'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjSimulatorInfo = {
            RegionID: UUID_1.UUID.zero(),
            SimName: Buffer.allocUnsafe(0),
            EstateID: 0,
            SimAccess: 0
        };
        newObjSimulatorInfo['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjSimulatorInfo['SimName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjSimulatorInfo['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimulatorInfo['SimAccess'] = buf.readUInt8(pos++);
        this.SimulatorInfo = newObjSimulatorInfo;
        return pos - startPos;
    }
}
exports.UpdateSimulatorMessage = UpdateSimulatorMessage;
//# sourceMappingURL=UpdateSimulator.js.map