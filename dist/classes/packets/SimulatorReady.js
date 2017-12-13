"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SimulatorReadyPacket {
    constructor() {
        this.name = 'SimulatorReady';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901769;
    }
    getSize() {
        return (this.SimulatorBlock['SimName'].length + 1) + 42;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.write(this.SimulatorBlock['SimName'], pos);
        pos += this.SimulatorBlock['SimName'].length;
        buf.writeUInt8(this.SimulatorBlock['SimAccess'], pos++);
        buf.writeUInt32LE(this.SimulatorBlock['RegionFlags'], pos);
        pos += 4;
        this.SimulatorBlock['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.SimulatorBlock['EstateID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.SimulatorBlock['ParentEstateID'], pos);
        pos += 4;
        buf.writeUInt8((this.TelehubBlock['HasTelehub']) ? 1 : 0, pos++);
        this.TelehubBlock['TelehubPos'].writeToBuffer(buf, pos, false);
        pos += 12;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjSimulatorBlock = {
            SimName: '',
            SimAccess: 0,
            RegionFlags: 0,
            RegionID: UUID_1.UUID.zero(),
            EstateID: 0,
            ParentEstateID: 0
        };
        newObjSimulatorBlock['SimName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjSimulatorBlock['SimAccess'] = buf.readUInt8(pos++);
        newObjSimulatorBlock['RegionFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimulatorBlock['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjSimulatorBlock['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimulatorBlock['ParentEstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        this.SimulatorBlock = newObjSimulatorBlock;
        const newObjTelehubBlock = {
            HasTelehub: false,
            TelehubPos: Vector3_1.Vector3.getZero()
        };
        newObjTelehubBlock['HasTelehub'] = (buf.readUInt8(pos++) === 1);
        newObjTelehubBlock['TelehubPos'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.TelehubBlock = newObjTelehubBlock;
        return pos - startPos;
    }
}
exports.SimulatorReadyPacket = SimulatorReadyPacket;
//# sourceMappingURL=SimulatorReady.js.map