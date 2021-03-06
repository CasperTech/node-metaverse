// This file has been automatically generated by writeMessageClasses.js

import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';

export class SetCPURatioMessage implements MessageBase
{
    name = 'SetCPURatio';
    messageFlags = MessageFlags.FrequencyLow;
    id = Message.SetCPURatio;

    Data: {
        Ratio: number;
    };

    getSize(): number
    {
        return 1;
    }

    // @ts-ignore
    writeToBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        buf.writeUInt8(this.Data['Ratio'], pos++);
        return pos - startPos;
    }

    // @ts-ignore
    readFromBuffer(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        const newObjData: {
            Ratio: number
        } = {
            Ratio: 0
        };
        newObjData['Ratio'] = buf.readUInt8(pos++);
        this.Data = newObjData;
        return pos - startPos;
    }
}

