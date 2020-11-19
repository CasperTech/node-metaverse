// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import * as Long from 'long';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class ObjectUpdateMessage implements MessageBase
{
    name = 'ObjectUpdate';
    messageFlags = MessageFlags.Trusted | MessageFlags.Zerocoded | MessageFlags.FrequencyHigh;
    id = Message.ObjectUpdate;

    RegionData: {
        RegionHandle: Long;
        TimeDilation: number;
    };
    ObjectData: {
        ID: number;
        State: number;
        FullID: UUID;
        CRC: number;
        PCode: number;
        Material: number;
        ClickAction: number;
        Scale: Vector3;
        ObjectData: Buffer;
        ParentID: number;
        UpdateFlags: number;
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
        TextureEntry: Buffer;
        TextureAnim: Buffer;
        NameValue: Buffer;
        Data: Buffer;
        Text: Buffer;
        TextColor: Buffer;
        MediaURL: Buffer;
        PSBlock: Buffer;
        ExtraParams: Buffer;
        Sound: UUID;
        OwnerID: UUID;
        Gain: number;
        Flags: number;
        Radius: number;
        JointType: number;
        JointPivot: Vector3;
        JointAxisOrAnchor: Vector3;
    }[];

    getSize(): number
    {
        return this.calculateVarVarSize(this.ObjectData, 'ObjectData', 1) + this.calculateVarVarSize(this.ObjectData, 'TextureEntry', 2) + this.calculateVarVarSize(this.ObjectData, 'TextureAnim', 1) + this.calculateVarVarSize(this.ObjectData, 'NameValue', 2) + this.calculateVarVarSize(this.ObjectData, 'Data', 2) + this.calculateVarVarSize(this.ObjectData, 'Text', 1) + this.calculateVarVarSize(this.ObjectData, 'MediaURL', 1) + this.calculateVarVarSize(this.ObjectData, 'PSBlock', 1) + this.calculateVarVarSize(this.ObjectData, 'ExtraParams', 1) + ((141) * this.ObjectData.length) + 11;
    }

    calculateVarVarSize(block: {[key: string]: any}[], paramName: string, extraPerVar: number): number
    {
        let size = 0;
        for (const bl of block)
        {
            size += bl[paramName].length + extraPerVar;
        }
        return size;
    }

    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        buf.writeInt32LE(this.RegionData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.RegionData['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt16LE(this.RegionData['TimeDilation'], pos);
        pos += 2;
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++)
        {
            buf.writeUInt32LE(this.ObjectData[i]['ID'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['State'], pos++);
            this.ObjectData[i]['FullID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.ObjectData[i]['CRC'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['PCode'], pos++);
            buf.writeUInt8(this.ObjectData[i]['Material'], pos++);
            buf.writeUInt8(this.ObjectData[i]['ClickAction'], pos++);
            this.ObjectData[i]['Scale'].writeToBuffer(buf, pos, false);
            pos += 12;
            buf.writeUInt8(this.ObjectData[i]['ObjectData'].length, pos++);
            this.ObjectData[i]['ObjectData'].copy(buf, pos);
            pos += this.ObjectData[i]['ObjectData'].length;
            buf.writeUInt32LE(this.ObjectData[i]['ParentID'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['UpdateFlags'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['PathCurve'], pos++);
            buf.writeUInt8(this.ObjectData[i]['ProfileCurve'], pos++);
            buf.writeUInt16LE(this.ObjectData[i]['PathBegin'], pos);
            pos += 2;
            buf.writeUInt16LE(this.ObjectData[i]['PathEnd'], pos);
            pos += 2;
            buf.writeUInt8(this.ObjectData[i]['PathScaleX'], pos++);
            buf.writeUInt8(this.ObjectData[i]['PathScaleY'], pos++);
            buf.writeUInt8(this.ObjectData[i]['PathShearX'], pos++);
            buf.writeUInt8(this.ObjectData[i]['PathShearY'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathTwist'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathTwistBegin'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathRadiusOffset'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathTaperX'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathTaperY'], pos++);
            buf.writeUInt8(this.ObjectData[i]['PathRevolutions'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathSkew'], pos++);
            buf.writeUInt16LE(this.ObjectData[i]['ProfileBegin'], pos);
            pos += 2;
            buf.writeUInt16LE(this.ObjectData[i]['ProfileEnd'], pos);
            pos += 2;
            buf.writeUInt16LE(this.ObjectData[i]['ProfileHollow'], pos);
            pos += 2;
            buf.writeUInt16LE(this.ObjectData[i]['TextureEntry'].length, pos);
            pos += 2;
            this.ObjectData[i]['TextureEntry'].copy(buf, pos);
            pos += this.ObjectData[i]['TextureEntry'].length;
            buf.writeUInt8(this.ObjectData[i]['TextureAnim'].length, pos++);
            this.ObjectData[i]['TextureAnim'].copy(buf, pos);
            pos += this.ObjectData[i]['TextureAnim'].length;
            buf.writeUInt16LE(this.ObjectData[i]['NameValue'].length, pos);
            pos += 2;
            this.ObjectData[i]['NameValue'].copy(buf, pos);
            pos += this.ObjectData[i]['NameValue'].length;
            buf.writeUInt16LE(this.ObjectData[i]['Data'].length, pos);
            pos += 2;
            this.ObjectData[i]['Data'].copy(buf, pos);
            pos += this.ObjectData[i]['Data'].length;
            buf.writeUInt8(this.ObjectData[i]['Text'].length, pos++);
            this.ObjectData[i]['Text'].copy(buf, pos);
            pos += this.ObjectData[i]['Text'].length;
            this.ObjectData[i]['TextColor'].copy(buf, pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['MediaURL'].length, pos++);
            this.ObjectData[i]['MediaURL'].copy(buf, pos);
            pos += this.ObjectData[i]['MediaURL'].length;
            buf.writeUInt8(this.ObjectData[i]['PSBlock'].length, pos++);
            this.ObjectData[i]['PSBlock'].copy(buf, pos);
            pos += this.ObjectData[i]['PSBlock'].length;
            buf.writeUInt8(this.ObjectData[i]['ExtraParams'].length, pos++);
            this.ObjectData[i]['ExtraParams'].copy(buf, pos);
            pos += this.ObjectData[i]['ExtraParams'].length;
            this.ObjectData[i]['Sound'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeFloatLE(this.ObjectData[i]['Gain'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['Flags'], pos++);
            buf.writeFloatLE(this.ObjectData[i]['Radius'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['JointType'], pos++);
            this.ObjectData[i]['JointPivot'].writeToBuffer(buf, pos, false);
            pos += 12;
            this.ObjectData[i]['JointAxisOrAnchor'].writeToBuffer(buf, pos, false);
            pos += 12;
        }
        return pos - startPos;
    }

    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjRegionData: {
            RegionHandle: Long,
            TimeDilation: number
        } = {
            RegionHandle: Long.ZERO,
            TimeDilation: 0
        };
        newObjRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos+4));
        pos += 8;
        newObjRegionData['TimeDilation'] = buf.readUInt16LE(pos);
        pos += 2;
        this.RegionData = newObjRegionData;
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++)
        {
            const newObjObjectData: {
                ID: number,
                State: number,
                FullID: UUID,
                CRC: number,
                PCode: number,
                Material: number,
                ClickAction: number,
                Scale: Vector3,
                ObjectData: Buffer,
                ParentID: number,
                UpdateFlags: number,
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
                TextureEntry: Buffer,
                TextureAnim: Buffer,
                NameValue: Buffer,
                Data: Buffer,
                Text: Buffer,
                TextColor: Buffer,
                MediaURL: Buffer,
                PSBlock: Buffer,
                ExtraParams: Buffer,
                Sound: UUID,
                OwnerID: UUID,
                Gain: number,
                Flags: number,
                Radius: number,
                JointType: number,
                JointPivot: Vector3,
                JointAxisOrAnchor: Vector3
            } = {
                ID: 0,
                State: 0,
                FullID: UUID.zero(),
                CRC: 0,
                PCode: 0,
                Material: 0,
                ClickAction: 0,
                Scale: Vector3.getZero(),
                ObjectData: Buffer.allocUnsafe(0),
                ParentID: 0,
                UpdateFlags: 0,
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
                TextureEntry: Buffer.allocUnsafe(0),
                TextureAnim: Buffer.allocUnsafe(0),
                NameValue: Buffer.allocUnsafe(0),
                Data: Buffer.allocUnsafe(0),
                Text: Buffer.allocUnsafe(0),
                TextColor: Buffer.allocUnsafe(0),
                MediaURL: Buffer.allocUnsafe(0),
                PSBlock: Buffer.allocUnsafe(0),
                ExtraParams: Buffer.allocUnsafe(0),
                Sound: UUID.zero(),
                OwnerID: UUID.zero(),
                Gain: 0,
                Flags: 0,
                Radius: 0,
                JointType: 0,
                JointPivot: Vector3.getZero(),
                JointAxisOrAnchor: Vector3.getZero()
            };
            newObjObjectData['ID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['State'] = buf.readUInt8(pos++);
            newObjObjectData['FullID'] = new UUID(buf, pos);
            pos += 16;
            newObjObjectData['CRC'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['PCode'] = buf.readUInt8(pos++);
            newObjObjectData['Material'] = buf.readUInt8(pos++);
            newObjObjectData['ClickAction'] = buf.readUInt8(pos++);
            newObjObjectData['Scale'] = new Vector3(buf, pos, false);
            pos += 12;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['ObjectData'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjObjectData['ParentID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['UpdateFlags'] = buf.readUInt32LE(pos);
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
            varLength = buf.readUInt16LE(pos);
            pos += 2;
            newObjObjectData['TextureEntry'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['TextureAnim'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt16LE(pos);
            pos += 2;
            newObjObjectData['NameValue'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt16LE(pos);
            pos += 2;
            newObjObjectData['Data'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['Text'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjObjectData['TextColor'] = buf.slice(pos, pos + 4);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['MediaURL'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['PSBlock'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['ExtraParams'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjObjectData['Sound'] = new UUID(buf, pos);
            pos += 16;
            newObjObjectData['OwnerID'] = new UUID(buf, pos);
            pos += 16;
            newObjObjectData['Gain'] = buf.readFloatLE(pos);
            pos += 4;
            newObjObjectData['Flags'] = buf.readUInt8(pos++);
            newObjObjectData['Radius'] = buf.readFloatLE(pos);
            pos += 4;
            newObjObjectData['JointType'] = buf.readUInt8(pos++);
            newObjObjectData['JointPivot'] = new Vector3(buf, pos, false);
            pos += 12;
            newObjObjectData['JointAxisOrAnchor'] = new Vector3(buf, pos, false);
            pos += 12;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}

