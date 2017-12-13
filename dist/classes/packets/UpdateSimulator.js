"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class UpdateSimulatorPacket {
    constructor() {
        this.name = 'UpdateSimulator';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901777;
    }
    getSize() {
        return (this.SimulatorInfo['SimName'].length + 1) + 21;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.SimulatorInfo['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.SimulatorInfo['SimName'], pos);
        pos += this.SimulatorInfo['SimName'].length;
        buf.writeUInt32LE(this.SimulatorInfo['EstateID'], pos);
        pos += 4;
        buf.writeUInt8(this.SimulatorInfo['SimAccess'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjSimulatorInfo = {
            RegionID: UUID_1.UUID.zero(),
            SimName: '',
            EstateID: 0,
            SimAccess: 0
        };
        newObjSimulatorInfo['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjSimulatorInfo['SimName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjSimulatorInfo['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimulatorInfo['SimAccess'] = buf.readUInt8(pos++);
        this.SimulatorInfo = newObjSimulatorInfo;
        return pos - startPos;
    }
}
exports.UpdateSimulatorPacket = UpdateSimulatorPacket;
//# sourceMappingURL=UpdateSimulator.js.map