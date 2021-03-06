// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class StateSaveMessage implements MessageBase
{
    name = 'StateSave';
    messageFlags = MessageFlags.FrequencyLow;
    id = Message.StateSave;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    DataBlock: {
        Filename: Buffer;
    };

    getSize(): number
    {
        return (this.DataBlock['Filename'].length + 1) + 32;
    }

    // @ts-ignore
    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.DataBlock['Filename'].length, pos++);
        this.DataBlock['Filename'].copy(buf, pos);
        pos += this.DataBlock['Filename'].length;
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
        const newObjDataBlock: {
            Filename: Buffer
        } = {
            Filename: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['Filename'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}

