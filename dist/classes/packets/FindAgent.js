"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
class FindAgentPacket {
    constructor() {
        this.name = 'FindAgent';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902016;
    }
    getSize() {
        return ((16) * this.LocationBlock.length) + 37;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentBlock['Hunter'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentBlock['Prey'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentBlock['SpaceIP'].writeToBuffer(buf, pos);
        pos += 4;
        const count = this.LocationBlock.length;
        buf.writeUInt8(this.LocationBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeDoubleLE(this.LocationBlock[i]['GlobalX'], pos);
            pos += 8;
            buf.writeDoubleLE(this.LocationBlock[i]['GlobalY'], pos);
            pos += 8;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentBlock = {
            Hunter: UUID_1.UUID.zero(),
            Prey: UUID_1.UUID.zero(),
            SpaceIP: IPAddress_1.IPAddress.zero()
        };
        newObjAgentBlock['Hunter'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentBlock['Prey'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentBlock['SpaceIP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        this.AgentBlock = newObjAgentBlock;
        const count = buf.readUInt8(pos++);
        this.LocationBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjLocationBlock = {
                GlobalX: 0,
                GlobalY: 0
            };
            newObjLocationBlock['GlobalX'] = buf.readDoubleLE(pos);
            pos += 8;
            newObjLocationBlock['GlobalY'] = buf.readDoubleLE(pos);
            pos += 8;
            this.LocationBlock.push(newObjLocationBlock);
        }
        return pos - startPos;
    }
}
exports.FindAgentPacket = FindAgentPacket;
//# sourceMappingURL=FindAgent.js.map