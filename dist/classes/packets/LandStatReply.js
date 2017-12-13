"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class LandStatReplyPacket {
    constructor() {
        this.name = 'LandStatReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902182;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.ReportData, 'TaskName', 1) + this.calculateVarVarSize(this.ReportData, 'OwnerName', 1) + 36) * this.ReportData.length) + 13;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.RequestData['ReportType'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RequestData['RequestFlags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RequestData['TotalObjectCount'], pos);
        pos += 4;
        const count = this.ReportData.length;
        buf.writeUInt8(this.ReportData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.ReportData[i]['TaskLocalID'], pos);
            pos += 4;
            this.ReportData[i]['TaskID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeFloatLE(this.ReportData[i]['LocationX'], pos);
            pos += 4;
            buf.writeFloatLE(this.ReportData[i]['LocationY'], pos);
            pos += 4;
            buf.writeFloatLE(this.ReportData[i]['LocationZ'], pos);
            pos += 4;
            buf.writeFloatLE(this.ReportData[i]['Score'], pos);
            pos += 4;
            buf.write(this.ReportData[i]['TaskName'], pos);
            pos += this.ReportData[i]['TaskName'].length;
            buf.write(this.ReportData[i]['OwnerName'], pos);
            pos += this.ReportData[i]['OwnerName'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRequestData = {
            ReportType: 0,
            RequestFlags: 0,
            TotalObjectCount: 0
        };
        newObjRequestData['ReportType'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRequestData['RequestFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRequestData['TotalObjectCount'] = buf.readUInt32LE(pos);
        pos += 4;
        this.RequestData = newObjRequestData;
        const count = buf.readUInt8(pos++);
        this.ReportData = [];
        for (let i = 0; i < count; i++) {
            const newObjReportData = {
                TaskLocalID: 0,
                TaskID: UUID_1.UUID.zero(),
                LocationX: 0,
                LocationY: 0,
                LocationZ: 0,
                Score: 0,
                TaskName: '',
                OwnerName: ''
            };
            newObjReportData['TaskLocalID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjReportData['TaskID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjReportData['LocationX'] = buf.readFloatLE(pos);
            pos += 4;
            newObjReportData['LocationY'] = buf.readFloatLE(pos);
            pos += 4;
            newObjReportData['LocationZ'] = buf.readFloatLE(pos);
            pos += 4;
            newObjReportData['Score'] = buf.readFloatLE(pos);
            pos += 4;
            newObjReportData['TaskName'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjReportData['OwnerName'] = buf.toString('utf8', pos, length);
            pos += length;
            this.ReportData.push(newObjReportData);
        }
        return pos - startPos;
    }
}
exports.LandStatReplyPacket = LandStatReplyPacket;
//# sourceMappingURL=LandStatReply.js.map