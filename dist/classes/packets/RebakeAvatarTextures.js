"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RebakeAvatarTexturesPacket {
    constructor() {
        this.name = 'RebakeAvatarTextures';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901847;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TextureData['TextureID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjTextureData = {
            TextureID: UUID_1.UUID.zero()
        };
        newObjTextureData['TextureID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.TextureData = newObjTextureData;
        return pos - startPos;
    }
}
exports.RebakeAvatarTexturesPacket = RebakeAvatarTexturesPacket;
//# sourceMappingURL=RebakeAvatarTextures.js.map