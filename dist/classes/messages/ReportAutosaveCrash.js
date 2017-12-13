"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ReportAutosaveCrashMessage {
    constructor() {
        this.name = 'ReportAutosaveCrash';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ReportAutosaveCrash;
    }
    getSize() {
        return 8;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.AutosaveData['PID'], pos);
        pos += 4;
        buf.writeInt32LE(this.AutosaveData['Status'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAutosaveData = {
            PID: 0,
            Status: 0
        };
        newObjAutosaveData['PID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjAutosaveData['Status'] = buf.readInt32LE(pos);
        pos += 4;
        this.AutosaveData = newObjAutosaveData;
        return pos - startPos;
    }
}
exports.ReportAutosaveCrashMessage = ReportAutosaveCrashMessage;
//# sourceMappingURL=ReportAutosaveCrash.js.map