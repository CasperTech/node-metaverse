"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AssetUploadRequestMessage {
    constructor() {
        this.name = 'AssetUploadRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AssetUploadRequest;
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
        buf.writeUInt16LE(this.AssetBlock['AssetData'].length, pos);
        pos += 2;
        this.AssetBlock['AssetData'].copy(buf, pos);
        pos += this.AssetBlock['AssetData'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAssetBlock = {
            TransactionID: UUID_1.UUID.zero(),
            Type: 0,
            Tempfile: false,
            StoreLocal: false,
            AssetData: Buffer.allocUnsafe(0)
        };
        newObjAssetBlock['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAssetBlock['Type'] = buf.readInt8(pos++);
        newObjAssetBlock['Tempfile'] = (buf.readUInt8(pos++) === 1);
        newObjAssetBlock['StoreLocal'] = (buf.readUInt8(pos++) === 1);
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjAssetBlock['AssetData'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.AssetBlock = newObjAssetBlock;
        return pos - startPos;
    }
}
exports.AssetUploadRequestMessage = AssetUploadRequestMessage;
//# sourceMappingURL=AssetUploadRequest.js.map