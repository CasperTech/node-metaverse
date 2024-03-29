// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class RezMultipleAttachmentsFromInvMessage implements MessageBase
{
    name = 'RezMultipleAttachmentsFromInv';
    messageFlags = MessageFlags.Zerocoded | MessageFlags.FrequencyLow;
    id = Message.RezMultipleAttachmentsFromInv;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    HeaderData: {
        CompoundMsgID: UUID;
        TotalObjects: number;
        FirstDetachAll: boolean;
    };
    ObjectData: {
        ItemID: UUID;
        OwnerID: UUID;
        AttachmentPt: number;
        ItemFlags: number;
        GroupMask: number;
        EveryoneMask: number;
        NextOwnerMask: number;
        Name: Buffer;
        Description: Buffer;
    }[];

    getSize(): number
    {
        return this.calculateVarVarSize(this.ObjectData, 'Name', 1) + this.calculateVarVarSize(this.ObjectData, 'Description', 1) + ((49) * this.ObjectData.length) + 51;
    }

    calculateVarVarSize(block: { [key: string]: any }[], paramName: string, extraPerVar: number): number
    {
        let size = 0;
        for (const bl of block)
        {
            size += bl[paramName].length + extraPerVar;
        }
        return size;
    }

    // @ts-ignore
    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.HeaderData['CompoundMsgID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.HeaderData['TotalObjects'], pos++);
        buf.writeUInt8((this.HeaderData['FirstDetachAll']) ? 1 : 0, pos++);
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++)
        {
            this.ObjectData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.ObjectData[i]['AttachmentPt'], pos++);
            buf.writeUInt32LE(this.ObjectData[i]['ItemFlags'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['GroupMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['EveryoneMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['NextOwnerMask'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['Name'].length, pos++);
            this.ObjectData[i]['Name'].copy(buf, pos);
            pos += this.ObjectData[i]['Name'].length;
            buf.writeUInt8(this.ObjectData[i]['Description'].length, pos++);
            this.ObjectData[i]['Description'].copy(buf, pos);
            pos += this.ObjectData[i]['Description'].length;
        }
        return pos - startPos;
    }

    // @ts-ignore
    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData: {
            AgentID: UUID,
            SessionID: UUID
        } = {
            AgentID: UUID.zero(),
            SessionID: UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjHeaderData: {
            CompoundMsgID: UUID,
            TotalObjects: number,
            FirstDetachAll: boolean
        } = {
            CompoundMsgID: UUID.zero(),
            TotalObjects: 0,
            FirstDetachAll: false
        };
        newObjHeaderData['CompoundMsgID'] = new UUID(buf, pos);
        pos += 16;
        newObjHeaderData['TotalObjects'] = buf.readUInt8(pos++);
        newObjHeaderData['FirstDetachAll'] = (buf.readUInt8(pos++) === 1);
        this.HeaderData = newObjHeaderData;
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++)
        {
            const newObjObjectData: {
                ItemID: UUID,
                OwnerID: UUID,
                AttachmentPt: number,
                ItemFlags: number,
                GroupMask: number,
                EveryoneMask: number,
                NextOwnerMask: number,
                Name: Buffer,
                Description: Buffer
            } = {
                ItemID: UUID.zero(),
                OwnerID: UUID.zero(),
                AttachmentPt: 0,
                ItemFlags: 0,
                GroupMask: 0,
                EveryoneMask: 0,
                NextOwnerMask: 0,
                Name: Buffer.allocUnsafe(0),
                Description: Buffer.allocUnsafe(0)
            };
            newObjObjectData['ItemID'] = new UUID(buf, pos);
            pos += 16;
            newObjObjectData['OwnerID'] = new UUID(buf, pos);
            pos += 16;
            newObjObjectData['AttachmentPt'] = buf.readUInt8(pos++);
            newObjObjectData['ItemFlags'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['GroupMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['EveryoneMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['NextOwnerMask'] = buf.readUInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['Description'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}

