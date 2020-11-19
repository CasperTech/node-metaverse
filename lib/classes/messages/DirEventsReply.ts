// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class DirEventsReplyMessage implements MessageBase
{
    name = 'DirEventsReply';
    messageFlags = MessageFlags.Trusted | MessageFlags.Zerocoded | MessageFlags.FrequencyLow;
    id = Message.DirEventsReply;

    AgentData: {
        AgentID: UUID;
    };
    QueryData: {
        QueryID: UUID;
    };
    QueryReplies: {
        OwnerID: UUID;
        Name: Buffer;
        EventID: number;
        Date: Buffer;
        UnixTime: number;
        EventFlags: number;
    }[];
    StatusData: {
        Status: number;
    }[];

    getSize(): number
    {
        return this.calculateVarVarSize(this.QueryReplies, 'Name', 1) + this.calculateVarVarSize(this.QueryReplies, 'Date', 1) + ((28) * this.QueryReplies.length) + ((4) * this.StatusData.length) + 34;
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
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.QueryData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        let count = this.QueryReplies.length;
        buf.writeUInt8(this.QueryReplies.length, pos++);
        for (let i = 0; i < count; i++)
        {
            this.QueryReplies[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.QueryReplies[i]['Name'].length, pos++);
            this.QueryReplies[i]['Name'].copy(buf, pos);
            pos += this.QueryReplies[i]['Name'].length;
            buf.writeUInt32LE(this.QueryReplies[i]['EventID'], pos);
            pos += 4;
            buf.writeUInt8(this.QueryReplies[i]['Date'].length, pos++);
            this.QueryReplies[i]['Date'].copy(buf, pos);
            pos += this.QueryReplies[i]['Date'].length;
            buf.writeUInt32LE(this.QueryReplies[i]['UnixTime'], pos);
            pos += 4;
            buf.writeUInt32LE(this.QueryReplies[i]['EventFlags'], pos);
            pos += 4;
        }
        count = this.StatusData.length;
        buf.writeUInt8(this.StatusData.length, pos++);
        for (let i = 0; i < count; i++)
        {
            buf.writeUInt32LE(this.StatusData[i]['Status'], pos);
            pos += 4;
        }
        return pos - startPos;
    }

    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData: {
            AgentID: UUID
        } = {
            AgentID: UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjQueryData: {
            QueryID: UUID
        } = {
            QueryID: UUID.zero()
        };
        newObjQueryData['QueryID'] = new UUID(buf, pos);
        pos += 16;
        this.QueryData = newObjQueryData;
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        let count = buf.readUInt8(pos++);
        this.QueryReplies = [];
        for (let i = 0; i < count; i++)
        {
            const newObjQueryReplies: {
                OwnerID: UUID,
                Name: Buffer,
                EventID: number,
                Date: Buffer,
                UnixTime: number,
                EventFlags: number
            } = {
                OwnerID: UUID.zero(),
                Name: Buffer.allocUnsafe(0),
                EventID: 0,
                Date: Buffer.allocUnsafe(0),
                UnixTime: 0,
                EventFlags: 0
            };
            newObjQueryReplies['OwnerID'] = new UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjQueryReplies['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjQueryReplies['EventID'] = buf.readUInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjQueryReplies['Date'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjQueryReplies['UnixTime'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjQueryReplies['EventFlags'] = buf.readUInt32LE(pos);
            pos += 4;
            this.QueryReplies.push(newObjQueryReplies);
        }
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        count = buf.readUInt8(pos++);
        this.StatusData = [];
        for (let i = 0; i < count; i++)
        {
            const newObjStatusData: {
                Status: number
            } = {
                Status: 0
            };
            newObjStatusData['Status'] = buf.readUInt32LE(pos);
            pos += 4;
            this.StatusData.push(newObjStatusData);
        }
        return pos - startPos;
    }
}

