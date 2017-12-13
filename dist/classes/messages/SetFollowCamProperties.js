"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SetFollowCamPropertiesMessage {
    constructor() {
        this.name = 'SetFollowCamProperties';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SetFollowCamProperties;
    }
    getSize() {
        return ((8) * this.CameraProperty.length) + 17;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ObjectData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.CameraProperty.length;
        buf.writeUInt8(this.CameraProperty.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeInt32LE(this.CameraProperty[i]['Type'], pos);
            pos += 4;
            buf.writeFloatLE(this.CameraProperty[i]['Value'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjObjectData = {
            ObjectID: UUID_1.UUID.zero()
        };
        newObjObjectData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.ObjectData = newObjObjectData;
        const count = buf.readUInt8(pos++);
        this.CameraProperty = [];
        for (let i = 0; i < count; i++) {
            const newObjCameraProperty = {
                Type: 0,
                Value: 0
            };
            newObjCameraProperty['Type'] = buf.readInt32LE(pos);
            pos += 4;
            newObjCameraProperty['Value'] = buf.readFloatLE(pos);
            pos += 4;
            this.CameraProperty.push(newObjCameraProperty);
        }
        return pos - startPos;
    }
}
exports.SetFollowCamPropertiesMessage = SetFollowCamPropertiesMessage;
//# sourceMappingURL=SetFollowCamProperties.js.map