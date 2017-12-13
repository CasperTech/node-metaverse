"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DataServerLogoutPacket {
    constructor() {
        this.name = 'DataServerLogout';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902011;
    }
    getSize() {
        return 37;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.UserData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.UserData['ViewerIP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt8((this.UserData['Disconnect']) ? 1 : 0, pos++);
        this.UserData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjUserData = {
            AgentID: UUID_1.UUID.zero(),
            ViewerIP: IPAddress_1.IPAddress.zero(),
            Disconnect: false,
            SessionID: UUID_1.UUID.zero()
        };
        newObjUserData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserData['ViewerIP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjUserData['Disconnect'] = (buf.readUInt8(pos++) === 1);
        newObjUserData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.UserData = newObjUserData;
        return pos - startPos;
    }
}
exports.DataServerLogoutPacket = DataServerLogoutPacket;
//# sourceMappingURL=DataServerLogout.js.map