"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ImageNotInDatabaseMessage {
    constructor() {
        this.name = 'ImageNotInDatabase';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ImageNotInDatabase;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ImageID['ID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjImageID = {
            ID: UUID_1.UUID.zero()
        };
        newObjImageID['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.ImageID = newObjImageID;
        return pos - startPos;
    }
}
exports.ImageNotInDatabaseMessage = ImageNotInDatabaseMessage;
//# sourceMappingURL=ImageNotInDatabase.js.map