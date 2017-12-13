"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Quaternion_1 = require("../Quaternion");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AvatarSitResponseMessage {
    constructor() {
        this.name = 'AvatarSitResponse';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.AvatarSitResponse;
    }
    getSize() {
        return 66;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.SitObject['ID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.SitTransform['AutoPilot']) ? 1 : 0, pos++);
        this.SitTransform['SitPosition'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.SitTransform['SitRotation'].writeToBuffer(buf, pos);
        pos += 12;
        this.SitTransform['CameraEyeOffset'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.SitTransform['CameraAtOffset'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt8((this.SitTransform['ForceMouselook']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjSitObject = {
            ID: UUID_1.UUID.zero()
        };
        newObjSitObject['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.SitObject = newObjSitObject;
        const newObjSitTransform = {
            AutoPilot: false,
            SitPosition: Vector3_1.Vector3.getZero(),
            SitRotation: Quaternion_1.Quaternion.getIdentity(),
            CameraEyeOffset: Vector3_1.Vector3.getZero(),
            CameraAtOffset: Vector3_1.Vector3.getZero(),
            ForceMouselook: false
        };
        newObjSitTransform['AutoPilot'] = (buf.readUInt8(pos++) === 1);
        newObjSitTransform['SitPosition'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjSitTransform['SitRotation'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        newObjSitTransform['CameraEyeOffset'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjSitTransform['CameraAtOffset'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjSitTransform['ForceMouselook'] = (buf.readUInt8(pos++) === 1);
        this.SitTransform = newObjSitTransform;
        return pos - startPos;
    }
}
exports.AvatarSitResponseMessage = AvatarSitResponseMessage;
//# sourceMappingURL=AvatarSitResponse.js.map