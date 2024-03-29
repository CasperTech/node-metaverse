// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class UpdateInventoryFolderMessage implements MessageBase
{
    name = 'UpdateInventoryFolder';
    messageFlags = MessageFlags.FrequencyLow;
    id = Message.UpdateInventoryFolder;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    FolderData: {
        FolderID: UUID;
        ParentID: UUID;
        Type: number;
        Name: Buffer;
    }[];

    getSize(): number
    {
        return this.calculateVarVarSize(this.FolderData, 'Name', 1) + ((33) * this.FolderData.length) + 33;
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
        const count = this.FolderData.length;
        buf.writeUInt8(this.FolderData.length, pos++);
        for (let i = 0; i < count; i++)
        {
            this.FolderData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            this.FolderData[i]['ParentID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.FolderData[i]['Type'], pos++);
            buf.writeUInt8(this.FolderData[i]['Name'].length, pos++);
            this.FolderData[i]['Name'].copy(buf, pos);
            pos += this.FolderData[i]['Name'].length;
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
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        const count = buf.readUInt8(pos++);
        this.FolderData = [];
        for (let i = 0; i < count; i++)
        {
            const newObjFolderData: {
                FolderID: UUID,
                ParentID: UUID,
                Type: number,
                Name: Buffer
            } = {
                FolderID: UUID.zero(),
                ParentID: UUID.zero(),
                Type: 0,
                Name: Buffer.allocUnsafe(0)
            };
            newObjFolderData['FolderID'] = new UUID(buf, pos);
            pos += 16;
            newObjFolderData['ParentID'] = new UUID(buf, pos);
            pos += 16;
            newObjFolderData['Type'] = buf.readInt8(pos++);
            varLength = buf.readUInt8(pos++);
            newObjFolderData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.FolderData.push(newObjFolderData);
        }
        return pos - startPos;
    }
}

