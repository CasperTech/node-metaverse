"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ClearFollowCamPropertiesMessage {
    constructor() {
        this.name = 'ClearFollowCamProperties';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ClearFollowCamProperties;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ObjectData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
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
        return pos - startPos;
    }
}
exports.ClearFollowCamPropertiesMessage = ClearFollowCamPropertiesMessage;
//# sourceMappingURL=ClearFollowCamProperties.js.map