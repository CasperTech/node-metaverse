"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class SimulatorLoadPacket {
    constructor() {
        this.name = 'SimulatorLoad';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901772;
    }
    getSize() {
        return ((6) * this.AgentList.length) + 10;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeFloatLE(this.SimulatorLoad['TimeDilation'], pos);
        pos += 4;
        buf.writeInt32LE(this.SimulatorLoad['AgentCount'], pos);
        pos += 4;
        buf.writeUInt8((this.SimulatorLoad['CanAcceptAgents']) ? 1 : 0, pos++);
        const count = this.AgentList.length;
        buf.writeUInt8(this.AgentList.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.AgentList[i]['CircuitCode'], pos);
            pos += 4;
            buf.writeUInt8(this.AgentList[i]['X'], pos++);
            buf.writeUInt8(this.AgentList[i]['Y'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjSimulatorLoad = {
            TimeDilation: 0,
            AgentCount: 0,
            CanAcceptAgents: false
        };
        newObjSimulatorLoad['TimeDilation'] = buf.readFloatLE(pos);
        pos += 4;
        newObjSimulatorLoad['AgentCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjSimulatorLoad['CanAcceptAgents'] = (buf.readUInt8(pos++) === 1);
        this.SimulatorLoad = newObjSimulatorLoad;
        const count = buf.readUInt8(pos++);
        this.AgentList = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentList = {
                CircuitCode: 0,
                X: 0,
                Y: 0
            };
            newObjAgentList['CircuitCode'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjAgentList['X'] = buf.readUInt8(pos++);
            newObjAgentList['Y'] = buf.readUInt8(pos++);
            this.AgentList.push(newObjAgentList);
        }
        return pos - startPos;
    }
}
exports.SimulatorLoadPacket = SimulatorLoadPacket;
//# sourceMappingURL=SimulatorLoad.js.map