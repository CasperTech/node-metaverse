"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UserReportMessage {
    constructor() {
        this.name = 'UserReport';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UserReport;
    }
    getSize() {
        return (this.ReportData['AbuseRegionName'].length + 1 + this.ReportData['Summary'].length + 1 + this.ReportData['Details'].length + 2 + this.ReportData['VersionString'].length + 1) + 111;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ReportData['ReportType'], pos++);
        buf.writeUInt8(this.ReportData['Category'], pos++);
        this.ReportData['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt8(this.ReportData['CheckFlags'], pos++);
        this.ReportData['ScreenshotID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ReportData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ReportData['AbuserID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ReportData['AbuseRegionName'].length, pos++);
        this.ReportData['AbuseRegionName'].copy(buf, pos);
        pos += this.ReportData['AbuseRegionName'].length;
        this.ReportData['AbuseRegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ReportData['Summary'].length, pos++);
        this.ReportData['Summary'].copy(buf, pos);
        pos += this.ReportData['Summary'].length;
        buf.writeUInt16LE(this.ReportData['Details'].length, pos);
        pos += 2;
        this.ReportData['Details'].copy(buf, pos);
        pos += this.ReportData['Details'].length;
        buf.writeUInt8(this.ReportData['VersionString'].length, pos++);
        this.ReportData['VersionString'].copy(buf, pos);
        pos += this.ReportData['VersionString'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjReportData = {
            ReportType: 0,
            Category: 0,
            Position: Vector3_1.Vector3.getZero(),
            CheckFlags: 0,
            ScreenshotID: UUID_1.UUID.zero(),
            ObjectID: UUID_1.UUID.zero(),
            AbuserID: UUID_1.UUID.zero(),
            AbuseRegionName: Buffer.allocUnsafe(0),
            AbuseRegionID: UUID_1.UUID.zero(),
            Summary: Buffer.allocUnsafe(0),
            Details: Buffer.allocUnsafe(0),
            VersionString: Buffer.allocUnsafe(0)
        };
        newObjReportData['ReportType'] = buf.readUInt8(pos++);
        newObjReportData['Category'] = buf.readUInt8(pos++);
        newObjReportData['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjReportData['CheckFlags'] = buf.readUInt8(pos++);
        newObjReportData['ScreenshotID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjReportData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjReportData['AbuserID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjReportData['AbuseRegionName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjReportData['AbuseRegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjReportData['Summary'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjReportData['Details'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjReportData['VersionString'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ReportData = newObjReportData;
        return pos - startPos;
    }
}
exports.UserReportMessage = UserReportMessage;
//# sourceMappingURL=UserReport.js.map