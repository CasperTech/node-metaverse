"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AssetUploadRequestPacket {
    constructor() {
        this.name = 'AssetUploadRequest';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902093;
    }
    getSize() {
        return (this.AssetBlock['AssetData'].length + 2) + 19;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AssetBlock['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt8(this.AssetBlock['Type'], pos++);
        buf.writeUInt8((this.AssetBlock['Tempfile']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AssetBlock['StoreLocal']) ? 1 : 0, pos++);
        buf.write(this.AssetBlock['AssetData'], pos);
        pos += this.AssetBlock['AssetData'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAssetBlock = {
            TransactionID: UUID_1.UUID.zero(),
            Type: 0,
            Tempfile: false,
            StoreLocal: false,
            AssetData: ''
        };
        newObjAssetBlock['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAssetBlock['Type'] = buf.readInt8(pos++);
        newObjAssetBlock['Tempfile'] = (buf.readUInt8(pos++) === 1);
        newObjAssetBlock['StoreLocal'] = (buf.readUInt8(pos++) === 1);
        newObjAssetBlock['AssetData'] = buf.toString('utf8', pos, length);
        pos += length;
        this.AssetBlock = newObjAssetBlock;
        return pos - startPos;
    }
}
exports.AssetUploadRequestPacket = AssetUploadRequestPacket;
//# sourceMappingURL=AssetUploadRequest.js.map