// This file has been automatically generated by writeMessageClasses.js

import {UUID} from '../UUID';
import {Vector3} from '../Vector3';
import {Quaternion} from '../Quaternion';
import {MessageFlags} from '../../enums/MessageFlags';
import {MessageBase} from '../MessageBase';
import {Message} from '../../enums/Message';

export class ObjectAddMessage implements MessageBase
{
    name = 'ObjectAdd';
    messageFlags = MessageFlags.Zerocoded | MessageFlags.FrequencyMedium;
    id = Message.ObjectAdd;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupID: UUID;
    };
    ObjectData: {
        PCode: number;
        Material: number;
        AddFlags: number;
        PathCurve: number;
        ProfileCurve: number;
        PathBegin: number;
        PathEnd: number;
        PathScaleX: number;
        PathScaleY: number;
        PathShearX: number;
        PathShearY: number;
        PathTwist: number;
        PathTwistBegin: number;
        PathRadiusOffset: number;
        PathTaperX: number;
        PathTaperY: number;
        PathRevolutions: number;
        PathSkew: number;
        ProfileBegin: number;
        ProfileEnd: number;
        ProfileHollow: number;
        BypassRaycast: number;
        RayStart: Vector3;
        RayEnd: Vector3;
        RayTargetID: UUID;
        RayEndIsIntersection: number;
        Scale: Vector3;
        Rotation: Quaternion;
        State: number;
    };

    getSize(): number
    {
        return 144;
    }

    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ObjectData['PCode'], pos++);
        buf.writeUInt8(this.ObjectData['Material'], pos++);
        buf.writeUInt32LE(this.ObjectData['AddFlags'], pos);
        pos += 4;
        buf.writeUInt8(this.ObjectData['PathCurve'], pos++);
        buf.writeUInt8(this.ObjectData['ProfileCurve'], pos++);
        buf.writeUInt16LE(this.ObjectData['PathBegin'], pos);
        pos += 2;
        buf.writeUInt16LE(this.ObjectData['PathEnd'], pos);
        pos += 2;
        buf.writeUInt8(this.ObjectData['PathScaleX'], pos++);
        buf.writeUInt8(this.ObjectData['PathScaleY'], pos++);
        buf.writeUInt8(this.ObjectData['PathShearX'], pos++);
        buf.writeUInt8(this.ObjectData['PathShearY'], pos++);
        buf.writeInt8(this.ObjectData['PathTwist'], pos++);
        buf.writeInt8(this.ObjectData['PathTwistBegin'], pos++);
        buf.writeInt8(this.ObjectData['PathRadiusOffset'], pos++);
        buf.writeInt8(this.ObjectData['PathTaperX'], pos++);
        buf.writeInt8(this.ObjectData['PathTaperY'], pos++);
        buf.writeUInt8(this.ObjectData['PathRevolutions'], pos++);
        buf.writeInt8(this.ObjectData['PathSkew'], pos++);
        buf.writeUInt16LE(this.ObjectData['ProfileBegin'], pos);
        pos += 2;
        buf.writeUInt16LE(this.ObjectData['ProfileEnd'], pos);
        pos += 2;
        buf.writeUInt16LE(this.ObjectData['ProfileHollow'], pos);
        pos += 2;
        buf.writeUInt8(this.ObjectData['BypassRaycast'], pos++);
        this.ObjectData['RayStart'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ObjectData['RayEnd'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ObjectData['RayTargetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ObjectData['RayEndIsIntersection'], pos++);
        this.ObjectData['Scale'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ObjectData['Rotation'].writeToBuffer(buf, pos);
        pos += 12;
        buf.writeUInt8(this.ObjectData['State'], pos++);
        return pos - startPos;
    }

    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData: {
            AgentID: UUID,
            SessionID: UUID,
            GroupID: UUID
        } = {
            AgentID: UUID.zero(),
            SessionID: UUID.zero(),
            GroupID: UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjObjectData: {
            PCode: number,
            Material: number,
            AddFlags: number,
            PathCurve: number,
            ProfileCurve: number,
            PathBegin: number,
            PathEnd: number,
            PathScaleX: number,
            PathScaleY: number,
            PathShearX: number,
            PathShearY: number,
            PathTwist: number,
            PathTwistBegin: number,
            PathRadiusOffset: number,
            PathTaperX: number,
            PathTaperY: number,
            PathRevolutions: number,
            PathSkew: number,
            ProfileBegin: number,
            ProfileEnd: number,
            ProfileHollow: number,
            BypassRaycast: number,
            RayStart: Vector3,
            RayEnd: Vector3,
            RayTargetID: UUID,
            RayEndIsIntersection: number,
            Scale: Vector3,
            Rotation: Quaternion,
            State: number
        } = {
            PCode: 0,
            Material: 0,
            AddFlags: 0,
            PathCurve: 0,
            ProfileCurve: 0,
            PathBegin: 0,
            PathEnd: 0,
            PathScaleX: 0,
            PathScaleY: 0,
            PathShearX: 0,
            PathShearY: 0,
            PathTwist: 0,
            PathTwistBegin: 0,
            PathRadiusOffset: 0,
            PathTaperX: 0,
            PathTaperY: 0,
            PathRevolutions: 0,
            PathSkew: 0,
            ProfileBegin: 0,
            ProfileEnd: 0,
            ProfileHollow: 0,
            BypassRaycast: 0,
            RayStart: Vector3.getZero(),
            RayEnd: Vector3.getZero(),
            RayTargetID: UUID.zero(),
            RayEndIsIntersection: 0,
            Scale: Vector3.getZero(),
            Rotation: Quaternion.getIdentity(),
            State: 0
        };
        newObjObjectData['PCode'] = buf.readUInt8(pos++);
        newObjObjectData['Material'] = buf.readUInt8(pos++);
        newObjObjectData['AddFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjObjectData['PathCurve'] = buf.readUInt8(pos++);
        newObjObjectData['ProfileCurve'] = buf.readUInt8(pos++);
        newObjObjectData['PathBegin'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['PathEnd'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['PathScaleX'] = buf.readUInt8(pos++);
        newObjObjectData['PathScaleY'] = buf.readUInt8(pos++);
        newObjObjectData['PathShearX'] = buf.readUInt8(pos++);
        newObjObjectData['PathShearY'] = buf.readUInt8(pos++);
        newObjObjectData['PathTwist'] = buf.readInt8(pos++);
        newObjObjectData['PathTwistBegin'] = buf.readInt8(pos++);
        newObjObjectData['PathRadiusOffset'] = buf.readInt8(pos++);
        newObjObjectData['PathTaperX'] = buf.readInt8(pos++);
        newObjObjectData['PathTaperY'] = buf.readInt8(pos++);
        newObjObjectData['PathRevolutions'] = buf.readUInt8(pos++);
        newObjObjectData['PathSkew'] = buf.readInt8(pos++);
        newObjObjectData['ProfileBegin'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['ProfileEnd'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['ProfileHollow'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['BypassRaycast'] = buf.readUInt8(pos++);
        newObjObjectData['RayStart'] = new Vector3(buf, pos, false);
        pos += 12;
        newObjObjectData['RayEnd'] = new Vector3(buf, pos, false);
        pos += 12;
        newObjObjectData['RayTargetID'] = new UUID(buf, pos);
        pos += 16;
        newObjObjectData['RayEndIsIntersection'] = buf.readUInt8(pos++);
        newObjObjectData['Scale'] = new Vector3(buf, pos, false);
        pos += 12;
        newObjObjectData['Rotation'] = new Quaternion(buf, pos);
        pos += 12;
        newObjObjectData['State'] = buf.readUInt8(pos++);
        this.ObjectData = newObjObjectData;
        return pos - startPos;
    }
}
