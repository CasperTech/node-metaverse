"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const Quaternion_1 = require("../Quaternion");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ChildAgentUpdatePacket {
    constructor() {
        this.name = 'ChildAgentUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 25;
    }
    getSize() {
        return (this.AgentData['Throttles'].length + 1 + this.AgentData['AgentTextures'].length + 2) + ((25) * this.GroupData.length) + ((32) * this.AnimationData.length) + ((16) * this.GranterBlock.length) + ((this.calculateVarVarSize(this.NVPairData, 'NVPairs', 2)) * this.NVPairData.length) + ((1) * this.VisualParam.length) + ((2) * this.AgentAccess.length) + ((4) * this.AgentInfo.length) + ((this.calculateVarVarSize(this.AgentInventoryHost, 'InventoryHost', 1)) * this.AgentInventoryHost.length) + 216;
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
        buf.writeInt32LE(this.AgentData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.AgentData['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt32LE(this.AgentData['ViewerCircuitCode'], pos);
        pos += 4;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['AgentPos'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['AgentVel'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['Center'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['Size'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['AtAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['LeftAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['UpAxis'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt8((this.AgentData['ChangedGrid']) ? 1 : 0, pos++);
        buf.writeFloatLE(this.AgentData['Far'], pos);
        pos += 4;
        buf.writeFloatLE(this.AgentData['Aspect'], pos);
        pos += 4;
        buf.write(this.AgentData['Throttles'], pos);
        pos += this.AgentData['Throttles'].length;
        buf.writeUInt32LE(this.AgentData['LocomotionState'], pos);
        pos += 4;
        this.AgentData['HeadRotation'].writeToBuffer(buf, pos);
        pos += 12;
        this.AgentData['BodyRotation'].writeToBuffer(buf, pos);
        pos += 12;
        buf.writeUInt32LE(this.AgentData['ControlFlags'], pos);
        pos += 4;
        buf.writeFloatLE(this.AgentData['EnergyLevel'], pos);
        pos += 4;
        buf.writeUInt8(this.AgentData['GodLevel'], pos++);
        buf.writeUInt8((this.AgentData['AlwaysRun']) ? 1 : 0, pos++);
        this.AgentData['PreyAgent'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.AgentData['AgentAccess'], pos++);
        buf.write(this.AgentData['AgentTextures'], pos);
        pos += this.AgentData['AgentTextures'].length;
        this.AgentData['ActiveGroupID'].writeToBuffer(buf, pos);
        pos += 16;
        let count = this.GroupData.length;
        buf.writeUInt8(this.GroupData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.GroupData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.GroupData[i]['GroupPowers'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.GroupData[i]['GroupPowers'].high, pos);
            pos += 4;
            buf.writeUInt8((this.GroupData[i]['AcceptNotices']) ? 1 : 0, pos++);
        }
        count = this.AnimationData.length;
        buf.writeUInt8(this.AnimationData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AnimationData[i]['Animation'].writeToBuffer(buf, pos);
            pos += 16;
            this.AnimationData[i]['ObjectID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        count = this.GranterBlock.length;
        buf.writeUInt8(this.GranterBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            this.GranterBlock[i]['GranterID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        count = this.NVPairData.length;
        buf.writeUInt8(this.NVPairData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.write(this.NVPairData[i]['NVPairs'], pos);
            pos += this.NVPairData[i]['NVPairs'].length;
        }
        count = this.VisualParam.length;
        buf.writeUInt8(this.VisualParam.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.VisualParam[i]['ParamValue'], pos++);
        }
        count = this.AgentAccess.length;
        buf.writeUInt8(this.AgentAccess.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.AgentAccess[i]['AgentLegacyAccess'], pos++);
            buf.writeUInt8(this.AgentAccess[i]['AgentMaxAccess'], pos++);
        }
        count = this.AgentInfo.length;
        buf.writeUInt8(this.AgentInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.AgentInfo[i]['Flags'], pos);
            pos += 4;
        }
        count = this.AgentInventoryHost.length;
        buf.writeUInt8(this.AgentInventoryHost.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.write(this.AgentInventoryHost[i]['InventoryHost'], pos);
            pos += this.AgentInventoryHost[i]['InventoryHost'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            RegionHandle: Long.ZERO,
            ViewerCircuitCode: 0,
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            AgentPos: Vector3_1.Vector3.getZero(),
            AgentVel: Vector3_1.Vector3.getZero(),
            Center: Vector3_1.Vector3.getZero(),
            Size: Vector3_1.Vector3.getZero(),
            AtAxis: Vector3_1.Vector3.getZero(),
            LeftAxis: Vector3_1.Vector3.getZero(),
            UpAxis: Vector3_1.Vector3.getZero(),
            ChangedGrid: false,
            Far: 0,
            Aspect: 0,
            Throttles: '',
            LocomotionState: 0,
            HeadRotation: Quaternion_1.Quaternion.getIdentity(),
            BodyRotation: Quaternion_1.Quaternion.getIdentity(),
            ControlFlags: 0,
            EnergyLevel: 0,
            GodLevel: 0,
            AlwaysRun: false,
            PreyAgent: UUID_1.UUID.zero(),
            AgentAccess: 0,
            AgentTextures: '',
            ActiveGroupID: UUID_1.UUID.zero()
        };
        newObjAgentData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjAgentData['ViewerCircuitCode'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['AgentPos'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['AgentVel'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['Center'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['Size'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['AtAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['LeftAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['UpAxis'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['ChangedGrid'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['Far'] = buf.readFloatLE(pos);
        pos += 4;
        newObjAgentData['Aspect'] = buf.readFloatLE(pos);
        pos += 4;
        newObjAgentData['Throttles'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['LocomotionState'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['HeadRotation'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        newObjAgentData['BodyRotation'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        newObjAgentData['ControlFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['EnergyLevel'] = buf.readFloatLE(pos);
        pos += 4;
        newObjAgentData['GodLevel'] = buf.readUInt8(pos++);
        newObjAgentData['AlwaysRun'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['PreyAgent'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['AgentAccess'] = buf.readUInt8(pos++);
        newObjAgentData['AgentTextures'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['ActiveGroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        let count = buf.readUInt8(pos++);
        this.GroupData = [];
        for (let i = 0; i < count; i++) {
            const newObjGroupData = {
                GroupID: UUID_1.UUID.zero(),
                GroupPowers: Long.ZERO,
                AcceptNotices: false
            };
            newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjGroupData['GroupPowers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjGroupData['AcceptNotices'] = (buf.readUInt8(pos++) === 1);
            this.GroupData.push(newObjGroupData);
        }
        count = buf.readUInt8(pos++);
        this.AnimationData = [];
        for (let i = 0; i < count; i++) {
            const newObjAnimationData = {
                Animation: UUID_1.UUID.zero(),
                ObjectID: UUID_1.UUID.zero()
            };
            newObjAnimationData['Animation'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjAnimationData['ObjectID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.AnimationData.push(newObjAnimationData);
        }
        count = buf.readUInt8(pos++);
        this.GranterBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjGranterBlock = {
                GranterID: UUID_1.UUID.zero()
            };
            newObjGranterBlock['GranterID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.GranterBlock.push(newObjGranterBlock);
        }
        count = buf.readUInt8(pos++);
        this.NVPairData = [];
        for (let i = 0; i < count; i++) {
            const newObjNVPairData = {
                NVPairs: ''
            };
            newObjNVPairData['NVPairs'] = buf.toString('utf8', pos, length);
            pos += length;
            this.NVPairData.push(newObjNVPairData);
        }
        count = buf.readUInt8(pos++);
        this.VisualParam = [];
        for (let i = 0; i < count; i++) {
            const newObjVisualParam = {
                ParamValue: 0
            };
            newObjVisualParam['ParamValue'] = buf.readUInt8(pos++);
            this.VisualParam.push(newObjVisualParam);
        }
        count = buf.readUInt8(pos++);
        this.AgentAccess = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentAccess = {
                AgentLegacyAccess: 0,
                AgentMaxAccess: 0
            };
            newObjAgentAccess['AgentLegacyAccess'] = buf.readUInt8(pos++);
            newObjAgentAccess['AgentMaxAccess'] = buf.readUInt8(pos++);
            this.AgentAccess.push(newObjAgentAccess);
        }
        count = buf.readUInt8(pos++);
        this.AgentInfo = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentInfo = {
                Flags: 0
            };
            newObjAgentInfo['Flags'] = buf.readUInt32LE(pos);
            pos += 4;
            this.AgentInfo.push(newObjAgentInfo);
        }
        count = buf.readUInt8(pos++);
        this.AgentInventoryHost = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentInventoryHost = {
                InventoryHost: ''
            };
            newObjAgentInventoryHost['InventoryHost'] = buf.toString('utf8', pos, length);
            pos += length;
            this.AgentInventoryHost.push(newObjAgentInventoryHost);
        }
        return pos - startPos;
    }
}
exports.ChildAgentUpdatePacket = ChildAgentUpdatePacket;
//# sourceMappingURL=ChildAgentUpdate.js.map