"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AssetUploadCompletePacket {
    constructor() {
        this.name = 'AssetUploadComplete';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902094;
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
exports.AssetUploadCompletePacket = AssetUploadCompletePacket;
//# sourceMappingURL=AssetUploadComplete.js.map