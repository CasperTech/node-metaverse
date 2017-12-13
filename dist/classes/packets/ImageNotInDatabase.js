"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ImageNotInDatabasePacket {
    constructor() {
        this.name = 'ImageNotInDatabase';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901846;
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
        const newObjImageID = {
            ID: UUID_1.UUID.zero()
        };
        newObjImageID['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.ImageID = newObjImageID;
        return pos - startPos;
    }
}
exports.ImageNotInDatabasePacket = ImageNotInDatabasePacket;
//# sourceMappingURL=ImageNotInDatabase.js.map