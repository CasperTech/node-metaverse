// This file has been automatically generated by writeMessageClasses.js

import { IPAddress } from '../IPAddress';
import * as Long from 'long';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class EnableSimulatorMessage implements MessageBase
{
    name = 'EnableSimulator';
    messageFlags = MessageFlags.Trusted | MessageFlags.Blacklisted | MessageFlags.FrequencyLow;
    id = Message.EnableSimulator;

    SimulatorInfo: {
        Handle: Long;
        IP: IPAddress;
        Port: number;
    };

    getSize(): number
    {
        return 14;
    }

    // @ts-ignore
    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        buf.writeInt32LE(this.SimulatorInfo['Handle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.SimulatorInfo['Handle'].high, pos);
        pos += 4;
        this.SimulatorInfo['IP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt16LE(this.SimulatorInfo['Port'], pos);
        pos += 2;
        return pos - startPos;
    }

    // @ts-ignore
    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        const newObjSimulatorInfo: {
            Handle: Long,
            IP: IPAddress,
            Port: number
        } = {
            Handle: Long.ZERO,
            IP: IPAddress.zero(),
            Port: 0
        };
        newObjSimulatorInfo['Handle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjSimulatorInfo['IP'] = new IPAddress(buf, pos);
        pos += 4;
        newObjSimulatorInfo['Port'] = buf.readUInt16LE(pos);
        pos += 2;
        this.SimulatorInfo = newObjSimulatorInfo;
        return pos - startPos;
    }
}

