"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MergeParcelPacket {
    constructor() {
        this.name = 'MergeParcel';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901983;
    }
    getSize() {
        return ((16) * this.SlaveParcelData.length) + 17;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.MasterParcelData['MasterID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.SlaveParcelData.length;
        buf.writeUInt8(this.SlaveParcelData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.SlaveParcelData[i]['SlaveID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjMasterParcelData = {
            MasterID: UUID_1.UUID.zero()
        };
        newObjMasterParcelData['MasterID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.MasterParcelData = newObjMasterParcelData;
        const count = buf.readUInt8(pos++);
        this.SlaveParcelData = [];
        for (let i = 0; i < count; i++) {
            const newObjSlaveParcelData = {
                SlaveID: UUID_1.UUID.zero()
            };
            newObjSlaveParcelData['SlaveID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.SlaveParcelData.push(newObjSlaveParcelData);
        }
        return pos - startPos;
    }
}
exports.MergeParcelPacket = MergeParcelPacket;
//# sourceMappingURL=MergeParcel.js.map