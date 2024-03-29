// This file has been automatically generated by writeMessageClasses.js

import { UUID } from '../UUID';
import * as Long from 'long';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class GodUpdateRegionInfoMessage implements MessageBase
{
    name = 'GodUpdateRegionInfo';
    messageFlags = MessageFlags.Zerocoded | MessageFlags.FrequencyLow;
    id = Message.GodUpdateRegionInfo;

    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    RegionInfo: {
        SimName: Buffer;
        EstateID: number;
        ParentEstateID: number;
        RegionFlags: number;
        BillableFactor: number;
        PricePerMeter: number;
        RedirectGridX: number;
        RedirectGridY: number;
    };
    RegionInfo2: {
        RegionFlagsExtended: Long;
    }[];

    getSize(): number
    {
        return (this.RegionInfo['SimName'].length + 1) + ((8) * this.RegionInfo2.length) + 61;
    }

    // @ts-ignore
    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.RegionInfo['SimName'].length, pos++);
        this.RegionInfo['SimName'].copy(buf, pos);
        pos += this.RegionInfo['SimName'].length;
        buf.writeUInt32LE(this.RegionInfo['EstateID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RegionInfo['ParentEstateID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RegionInfo['RegionFlags'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['BillableFactor'], pos);
        pos += 4;
        buf.writeInt32LE(this.RegionInfo['PricePerMeter'], pos);
        pos += 4;
        buf.writeInt32LE(this.RegionInfo['RedirectGridX'], pos);
        pos += 4;
        buf.writeInt32LE(this.RegionInfo['RedirectGridY'], pos);
        pos += 4;
        const count = this.RegionInfo2.length;
        buf.writeUInt8(this.RegionInfo2.length, pos++);
        for (let i = 0; i < count; i++)
        {
            buf.writeInt32LE(this.RegionInfo2[i]['RegionFlagsExtended'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RegionInfo2[i]['RegionFlagsExtended'].high, pos);
            pos += 4;
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
        const newObjRegionInfo: {
            SimName: Buffer,
            EstateID: number,
            ParentEstateID: number,
            RegionFlags: number,
            BillableFactor: number,
            PricePerMeter: number,
            RedirectGridX: number,
            RedirectGridY: number
        } = {
            SimName: Buffer.allocUnsafe(0),
            EstateID: 0,
            ParentEstateID: 0,
            RegionFlags: 0,
            BillableFactor: 0,
            PricePerMeter: 0,
            RedirectGridX: 0,
            RedirectGridY: 0
        };
        varLength = buf.readUInt8(pos++);
        newObjRegionInfo['SimName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjRegionInfo['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo['ParentEstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo['RegionFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo['BillableFactor'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['PricePerMeter'] = buf.readInt32LE(pos);
        pos += 4;
        newObjRegionInfo['RedirectGridX'] = buf.readInt32LE(pos);
        pos += 4;
        newObjRegionInfo['RedirectGridY'] = buf.readInt32LE(pos);
        pos += 4;
        this.RegionInfo = newObjRegionInfo;
        if (pos >= buf.length)
        {
            return pos - startPos;
        }
        const count = buf.readUInt8(pos++);
        this.RegionInfo2 = [];
        for (let i = 0; i < count; i++)
        {
            const newObjRegionInfo2: {
                RegionFlagsExtended: Long
            } = {
                RegionFlagsExtended: Long.ZERO
            };
            newObjRegionInfo2['RegionFlagsExtended'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            this.RegionInfo2.push(newObjRegionInfo2);
        }
        return pos - startPos;
    }
}

