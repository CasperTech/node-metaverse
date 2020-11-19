// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class ScriptDialogMessage implements MessageBase
{
    name = 'ScriptDialog';
    messageFlags = MessageFlags.Trusted | MessageFlags.Zerocoded | MessageFlags.FrequencyLow;
    id = Message.ScriptDialog;

    Data: {
        ObjectID: UUID;
        FirstName: Buffer;
        LastName: Buffer;
        ObjectName: Buffer;
        Message: Buffer;
        ChatChannel: number;
        ImageID: UUID;
    };
    Buttons: {
        ButtonLabel: Buffer;
    }[];
    OwnerData: {
        OwnerID: UUID;
    }[];

    getSize(): number
    {
        return (this.Data['FirstName'].length + 1 + this.Data['LastName'].length + 1 + this.Data['ObjectName'].length + 1 + this.Data['Message'].length + 2) + this.calculateVarVarSize(this.Buttons, 'ButtonLabel', 1) + ((16) * this.OwnerData.length) + 38;
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
        this.Data['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.Data['FirstName'].length, pos++);
        this.Data['FirstName'].copy(buf, pos);
        pos += this.Data['FirstName'].length;
        buf.writeUInt8(this.Data['LastName'].length, pos++);
        this.Data['LastName'].copy(buf, pos);
        pos += this.Data['LastName'].length;
        buf.writeUInt8(this.Data['ObjectName'].length, pos++);
        this.Data['ObjectName'].copy(buf, pos);
        pos += this.Data['ObjectName'].length;
        buf.writeUInt16LE(this.Data['Message'].length, pos);
        pos += 2;
        this.Data['Message'].copy(buf, pos);
        pos += this.Data['Message'].length;
        buf.writeInt32LE(this.Data['ChatChannel'], pos);
        pos += 4;
        this.Data['ImageID'].writeToBuffer(buf, pos);
        pos += 16;
        let count = this.Buttons.length;
        buf.writeUInt8(this.Buttons.length, pos++);
        for (let i = 0; i < count; i++)
        {
            buf.writeUInt8(this.Buttons[i]['ButtonLabel'].length, pos++);
            this.Buttons[i]['ButtonLabel'].copy(buf, pos);
            pos += this.Buttons[i]['ButtonLabel'].length;
        }
        count = this.OwnerData.length;
        buf.writeUInt8(this.OwnerData.length, pos++);
        for (let i = 0; i < count; i++)
        {
            this.OwnerData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }

    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjData: {
            ObjectID: UUID,
            FirstName: Buffer,
            LastName: Buffer,
            ObjectName: Buffer,
            Message: Buffer,
            ChatChannel: number,
            ImageID: UUID
        } = {
            ObjectID: UUID.zero(),
            FirstName: Buffer.allocUnsafe(0),
            LastName: Buffer.allocUnsafe(0),
            ObjectName: Buffer.allocUnsafe(0),
            Message: Buffer.allocUnsafe(0),
            ChatChannel: 0,
            ImageID: UUID.zero()
        };
        newObjData['ObjectID'] = new UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjData['FirstName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjData['LastName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjData['ObjectName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjData['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjData['ChatChannel'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['ImageID'] = new UUID(buf, pos);
        pos += 16;
        this.Data = newObjData;
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        let count = buf.readUInt8(pos++);
        this.Buttons = [];
        for (let i = 0; i < count; i++)
        {
            const newObjButtons: {
                ButtonLabel: Buffer
            } = {
                ButtonLabel: Buffer.allocUnsafe(0)
            };
            varLength = buf.readUInt8(pos++);
            newObjButtons['ButtonLabel'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.Buttons.push(newObjButtons);
        }
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        count = buf.readUInt8(pos++);
        this.OwnerData = [];
        for (let i = 0; i < count; i++)
        {
            const newObjOwnerData: {
                OwnerID: UUID
            } = {
                OwnerID: UUID.zero()
            };
            newObjOwnerData['OwnerID'] = new UUID(buf, pos);
            pos += 16;
            this.OwnerData.push(newObjOwnerData);
        }
        return pos - startPos;
    }
}

