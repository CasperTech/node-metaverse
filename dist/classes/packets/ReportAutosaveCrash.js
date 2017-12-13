"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class ReportAutosaveCrashPacket {
    constructor() {
        this.name = 'ReportAutosaveCrash';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901888;
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
exports.ReportAutosaveCrashPacket = ReportAutosaveCrashPacket;
//# sourceMappingURL=ReportAutosaveCrash.js.map