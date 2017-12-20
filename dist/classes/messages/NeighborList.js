"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class NeighborListMessage {
    constructor() {
        this.name = 'NeighborList';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.NeighborList;
    }
    getSize() {
        return this.calculateVarVarSize(this.NeighborBlock, 'Name', 1) + 116;
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
            buf.writeUInt8(this.NeighborBlock[i]['Name'].length, pos++);
            this.NeighborBlock[i]['Name'].copy(buf, pos);
            pos += this.NeighborBlock[i]['Name'].length;
            buf.writeUInt8(this.NeighborBlock[i]['SimAccess'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = 4;
        this.NeighborBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjNeighborBlock = {
                IP: IPAddress_1.IPAddress.zero(),
                Port: 0,
                PublicIP: IPAddress_1.IPAddress.zero(),
                PublicPort: 0,
                RegionID: UUID_1.UUID.zero(),
                Name: Buffer.allocUnsafe(0),
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
            varLength = buf.readUInt8(pos++);
            newObjNeighborBlock['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjNeighborBlock['SimAccess'] = buf.readUInt8(pos++);
            this.NeighborBlock.push(newObjNeighborBlock);
        }
        return pos - startPos;
    }
}
exports.NeighborListMessage = NeighborListMessage;
//# sourceMappingURL=NeighborList.js.map