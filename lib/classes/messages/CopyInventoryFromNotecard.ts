// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class CopyInventoryFromNotecardMessage implements MessageBase
{
    name = 'CopyInventoryFromNotecard';
    messageFlags = MessageFlags.Zerocoded | MessageFlags.Deprecated | MessageFlags.FrequencyLow;
    id = Message.CopyInventoryFromNotecard;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    NotecardData: {
        NotecardItemID: UUID;
        ObjectID: UUID;
    };
    InventoryData: {
        ItemID: UUID;
        FolderID: UUID;
    }[];

    getSize(): number
    {
        return ((32) * this.InventoryData.length) + 65;
    }

    // @ts-ignore
    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.NotecardData['NotecardItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.NotecardData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.InventoryData.length;
        buf.writeUInt8(this.InventoryData.length, pos++);
        for (let i = 0; i < count; i++)
        {
            this.InventoryData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InventoryData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }

    // @ts-ignore
    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
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
        const newObjNotecardData: {
            NotecardItemID: UUID,
            ObjectID: UUID
        } = {
            NotecardItemID: UUID.zero(),
            ObjectID: UUID.zero()
        };
        newObjNotecardData['NotecardItemID'] = new UUID(buf, pos);
        pos += 16;
        newObjNotecardData['ObjectID'] = new UUID(buf, pos);
        pos += 16;
        this.NotecardData = newObjNotecardData;
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        const count = buf.readUInt8(pos++);
        this.InventoryData = [];
        for (let i = 0; i < count; i++)
        {
            const newObjInventoryData: {
                ItemID: UUID,
                FolderID: UUID
            } = {
                ItemID: UUID.zero(),
                FolderID: UUID.zero()
            };
            newObjInventoryData['ItemID'] = new UUID(buf, pos);
            pos += 16;
            newObjInventoryData['FolderID'] = new UUID(buf, pos);
            pos += 16;
            this.InventoryData.push(newObjInventoryData);
        }
        return pos - startPos;
    }
}

