"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
class NeighborListPacket {
    constructor() {
        this.name = 'NeighborList';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 3;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.NeighborBlock, 'Name', 1)) * 4) + 116;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = 4;
        for (let i = 0; i < count; i++) {
            this.NeighborBlock[i]['IP'].writeToBuffer(buf, pos);
            pos += 4;
            buf.writeUInt16LE(this.NeighborBlock[i]['Port'], pos);
            pos += 2;
            this.NeighborBlock[i]['PublicIP'].writeToBuffer(buf, pos);
            pos += 4;
            buf.writeUInt16LE(this.NeighborBlock[i]['PublicPort'], pos);
            pos += 2;
            this.NeighborBlock[i]['RegionID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.NeighborBlock[i]['Name'], pos);
            pos += this.NeighborBlock[i]['Name'].length;
            buf.writeUInt8(this.NeighborBlock[i]['SimAccess'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const count = 4;
        this.NeighborBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjNeighborBlock = {
                IP: IPAddress_1.IPAddress.zero(),
                Port: 0,
                PublicIP: IPAddress_1.IPAddress.zero(),
                PublicPort: 0,
                RegionID: UUID_1.UUID.zero(),
                Name: '',
                SimAccess: 0
            };
            newObjNeighborBlock['IP'] = new IPAddress_1.IPAddress(buf, pos);
            pos += 4;
            newObjNeighborBlock['Port'] = buf.readUInt16LE(pos);
            pos += 2;
            newObjNeighborBlock['PublicIP'] = new IPAddress_1.IPAddress(buf, pos);
            pos += 4;
            newObjNeighborBlock['PublicPort'] = buf.readUInt16LE(pos);
            pos += 2;
            newObjNeighborBlock['RegionID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjNeighborBlock['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjNeighborBlock['SimAccess'] = buf.readUInt8(pos++);
            this.NeighborBlock.push(newObjNeighborBlock);
        }
        return pos - startPos;
    }
}
exports.NeighborListPacket = NeighborListPacket;
//# sourceMappingURL=NeighborList.js.map