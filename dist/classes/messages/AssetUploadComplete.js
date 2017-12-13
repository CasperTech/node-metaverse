"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AssetUploadCompleteMessage {
    constructor() {
        this.name = 'AssetUploadComplete';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AssetUploadComplete;
    }
    getSize() {
        return 18;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AssetBlock['UUID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt8(this.AssetBlock['Type'], pos++);
        buf.writeUInt8((this.AssetBlock['Success']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAssetBlock = {
            UUID: UUID_1.UUID.zero(),
            Type: 0,
            Success: false
        };
        newObjAssetBlock['UUID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAssetBlock['Type'] = buf.readInt8(pos++);
        newObjAssetBlock['Success'] = (buf.readUInt8(pos++) === 1);
        this.AssetBlock = newObjAssetBlock;
        return pos - startPos;
    }
}
exports.AssetUploadCompleteMessage = AssetUploadCompleteMessage;
//# sourceMappingURL=AssetUploadComplete.js.map