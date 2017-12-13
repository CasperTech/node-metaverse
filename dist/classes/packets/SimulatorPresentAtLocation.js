"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SimulatorPresentAtLocationPacket {
    constructor() {
        this.name = 'SimulatorPresentAtLocation';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901771;
    }
    getSize() {
        return (this.SimulatorBlock['SimName'].length + 1) + ((13) * this.TelehubBlock.length) + 68;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt16LE(this.SimulatorPublicHostBlock['Port'], pos);
        pos += 2;
        this.SimulatorPublicHostBlock['SimulatorIP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt32LE(this.SimulatorPublicHostBlock['GridX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.SimulatorPublicHostBlock['GridY'], pos);
        pos += 4;
        let count = 4;
        for (let i = 0; i < count; i++) {
            this.NeighborBlock[i]['IP'].writeToBuffer(buf, pos);
            pos += 4;
            buf.writeUInt16LE(this.NeighborBlock[i]['Port'], pos);
            pos += 2;
        }
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
        count = this.TelehubBlock.length;
        buf.writeUInt8(this.TelehubBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8((this.TelehubBlock[i]['HasTelehub']) ? 1 : 0, pos++);
            this.TelehubBlock[i]['TelehubPos'].writeToBuffer(buf, pos, false);
            pos += 12;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjSimulatorPublicHostBlock = {
            Port: 0,
            SimulatorIP: IPAddress_1.IPAddress.zero(),
            GridX: 0,
            GridY: 0
        };
        newObjSimulatorPublicHostBlock['Port'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjSimulatorPublicHostBlock['SimulatorIP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjSimulatorPublicHostBlock['GridX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimulatorPublicHostBlock['GridY'] = buf.readUInt32LE(pos);
        pos += 4;
        this.SimulatorPublicHostBlock = newObjSimulatorPublicHostBlock;
        let count = 4;
        this.NeighborBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjNeighborBlock = {
                IP: IPAddress_1.IPAddress.zero(),
                Port: 0
            };
            newObjNeighborBlock['IP'] = new IPAddress_1.IPAddress(buf, pos);
            pos += 4;
            newObjNeighborBlock['Port'] = buf.readUInt16LE(pos);
            pos += 2;
            this.NeighborBlock.push(newObjNeighborBlock);
        }
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
        count = buf.readUInt8(pos++);
        this.TelehubBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjTelehubBlock = {
                HasTelehub: false,
                TelehubPos: Vector3_1.Vector3.getZero()
            };
            newObjTelehubBlock['HasTelehub'] = (buf.readUInt8(pos++) === 1);
            newObjTelehubBlock['TelehubPos'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            this.TelehubBlock.push(newObjTelehubBlock);
        }
        return pos - startPos;
    }
}
exports.SimulatorPresentAtLocationPacket = SimulatorPresentAtLocationPacket;
//# sourceMappingURL=SimulatorPresentAtLocation.js.map