// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class SetSimPresenceInDatabaseMessage implements MessageBase
{
    name = 'SetSimPresenceInDatabase';
    messageFlags = MessageFlags.Trusted | MessageFlags.FrequencyLow;
    id = Message.SetSimPresenceInDatabase;

    SimData: {
        RegionID: UUID;
        HostName: Buffer;
        GridX: number;
        GridY: number;
        PID: number;
        AgentCount: number;
        TimeToLive: number;
        Status: Buffer;
    };

    getSize(): number
    {
        return (this.SimData['HostName'].length + 1 + this.SimData['Status'].length + 1) + 36;
    }

    // @ts-ignore
    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.SimData['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.SimData['HostName'].length, pos++);
        this.SimData['HostName'].copy(buf, pos);
        pos += this.SimData['HostName'].length;
        buf.writeUInt32LE(this.SimData['GridX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.SimData['GridY'], pos);
        pos += 4;
        buf.writeInt32LE(this.SimData['PID'], pos);
        pos += 4;
        buf.writeInt32LE(this.SimData['AgentCount'], pos);
        pos += 4;
        buf.writeInt32LE(this.SimData['TimeToLive'], pos);
        pos += 4;
        buf.writeUInt8(this.SimData['Status'].length, pos++);
        this.SimData['Status'].copy(buf, pos);
        pos += this.SimData['Status'].length;
        return pos - startPos;
    }

    // @ts-ignore
    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        let varLength = 0;
        const newObjSimData: {
            RegionID: UUID,
            HostName: Buffer,
            GridX: number,
            GridY: number,
            PID: number,
            AgentCount: number,
            TimeToLive: number,
            Status: Buffer
        } = {
            RegionID: UUID.zero(),
            HostName: Buffer.allocUnsafe(0),
            GridX: 0,
            GridY: 0,
            PID: 0,
            AgentCount: 0,
            TimeToLive: 0,
            Status: Buffer.allocUnsafe(0)
        };
        newObjSimData['RegionID'] = new UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjSimData['HostName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjSimData['GridX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimData['GridY'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimData['PID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjSimData['AgentCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjSimData['TimeToLive'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjSimData['Status'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.SimData = newObjSimData;
        return pos - startPos;
    }
}

