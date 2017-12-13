"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MeanCollisionAlertPacket {
    constructor() {
        this.name = 'MeanCollisionAlert';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901896;
    }
    getSize() {
        return ((41) * this.MeanCollision.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.MeanCollision.length;
        buf.writeUInt8(this.MeanCollision.length, pos++);
        for (let i = 0; i < count; i++) {
            this.MeanCollision[i]['Victim'].writeToBuffer(buf, pos);
            pos += 16;
            this.MeanCollision[i]['Perp'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.MeanCollision[i]['Time'], pos);
            pos += 4;
            buf.writeFloatLE(this.MeanCollision[i]['Mag'], pos);
            pos += 4;
            buf.writeUInt8(this.MeanCollision[i]['Type'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const count = buf.readUInt8(pos++);
        this.MeanCollision = [];
        for (let i = 0; i < count; i++) {
            const newObjMeanCollision = {
                Victim: UUID_1.UUID.zero(),
                Perp: UUID_1.UUID.zero(),
                Time: 0,
                Mag: 0,
                Type: 0
            };
            newObjMeanCollision['Victim'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjMeanCollision['Perp'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjMeanCollision['Time'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjMeanCollision['Mag'] = buf.readFloatLE(pos);
            pos += 4;
            newObjMeanCollision['Type'] = buf.readUInt8(pos++);
            this.MeanCollision.push(newObjMeanCollision);
        }
        return pos - startPos;
    }
}
exports.MeanCollisionAlertPacket = MeanCollisionAlertPacket;
//# sourceMappingURL=MeanCollisionAlert.js.map