"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SendPostcardPacket {
    constructor() {
        this.name = 'SendPostcard';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902172;
    }
    getSize() {
        return (this.AgentData['To'].length + 1 + this.AgentData['From'].length + 1 + this.AgentData['Name'].length + 1 + this.AgentData['Subject'].length + 1 + this.AgentData['Msg'].length + 2) + 74;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['AssetID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['PosGlobal'].writeToBuffer(buf, pos, true);
        pos += 24;
        buf.write(this.AgentData['To'], pos);
        pos += this.AgentData['To'].length;
        buf.write(this.AgentData['From'], pos);
        pos += this.AgentData['From'].length;
        buf.write(this.AgentData['Name'], pos);
        pos += this.AgentData['Name'].length;
        buf.write(this.AgentData['Subject'], pos);
        pos += this.AgentData['Subject'].length;
        buf.write(this.AgentData['Msg'], pos);
        pos += this.AgentData['Msg'].length;
        buf.writeUInt8((this.AgentData['AllowPublish']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['MaturePublish']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            AssetID: UUID_1.UUID.zero(),
            PosGlobal: Vector3_1.Vector3.getZero(),
            To: '',
            From: '',
            Name: '',
            Subject: '',
            Msg: '',
            AllowPublish: false,
            MaturePublish: false
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['AssetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['PosGlobal'] = new Vector3_1.Vector3(buf, pos, true);
        pos += 24;
        newObjAgentData['To'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['From'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['Subject'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['Msg'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['AllowPublish'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['MaturePublish'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
exports.SendPostcardPacket = SendPostcardPacket;
//# sourceMappingURL=SendPostcard.js.map