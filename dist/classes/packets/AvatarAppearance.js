"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarAppearancePacket {
    constructor() {
        this.name = 'AvatarAppearance';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901918;
    }
    getSize() {
        return (this.ObjectData['TextureEntry'].length + 2) + ((1) * this.VisualParam.length) + ((9) * this.AppearanceData.length) + ((12) * this.AppearanceHover.length) + 20;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Sender['ID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.Sender['IsTrial']) ? 1 : 0, pos++);
        buf.write(this.ObjectData['TextureEntry'], pos);
        pos += this.ObjectData['TextureEntry'].length;
        let count = this.VisualParam.length;
        buf.writeUInt8(this.VisualParam.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.VisualParam[i]['ParamValue'], pos++);
        }
        count = this.AppearanceData.length;
        buf.writeUInt8(this.AppearanceData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.AppearanceData[i]['AppearanceVersion'], pos++);
            buf.writeInt32LE(this.AppearanceData[i]['CofVersion'], pos);
            pos += 4;
            buf.writeUInt32LE(this.AppearanceData[i]['Flags'], pos);
            pos += 4;
        }
        count = this.AppearanceHover.length;
        buf.writeUInt8(this.AppearanceHover.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AppearanceHover[i]['HoverHeight'].writeToBuffer(buf, pos, false);
            pos += 12;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjSender = {
            ID: UUID_1.UUID.zero(),
            IsTrial: false
        };
        newObjSender['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjSender['IsTrial'] = (buf.readUInt8(pos++) === 1);
        this.Sender = newObjSender;
        const newObjObjectData = {
            TextureEntry: ''
        };
        newObjObjectData['TextureEntry'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ObjectData = newObjObjectData;
        let count = buf.readUInt8(pos++);
        this.VisualParam = [];
        for (let i = 0; i < count; i++) {
            const newObjVisualParam = {
                ParamValue: 0
            };
            newObjVisualParam['ParamValue'] = buf.readUInt8(pos++);
            this.VisualParam.push(newObjVisualParam);
        }
        count = buf.readUInt8(pos++);
        this.AppearanceData = [];
        for (let i = 0; i < count; i++) {
            const newObjAppearanceData = {
                AppearanceVersion: 0,
                CofVersion: 0,
                Flags: 0
            };
            newObjAppearanceData['AppearanceVersion'] = buf.readUInt8(pos++);
            newObjAppearanceData['CofVersion'] = buf.readInt32LE(pos);
            pos += 4;
            newObjAppearanceData['Flags'] = buf.readUInt32LE(pos);
            pos += 4;
            this.AppearanceData.push(newObjAppearanceData);
        }
        count = buf.readUInt8(pos++);
        this.AppearanceHover = [];
        for (let i = 0; i < count; i++) {
            const newObjAppearanceHover = {
                HoverHeight: Vector3_1.Vector3.getZero()
            };
            newObjAppearanceHover['HoverHeight'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            this.AppearanceHover.push(newObjAppearanceHover);
        }
        return pos - startPos;
    }
}
exports.AvatarAppearancePacket = AvatarAppearancePacket;
//# sourceMappingURL=AvatarAppearance.js.map