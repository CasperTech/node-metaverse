/// <reference types="node" />
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SimStatsMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Region: {
        RegionX: number;
        RegionY: number;
        RegionFlags: number;
        ObjectCapacity: number;
    };
    Stat: {
        StatID: number;
        StatValue: number;
    }[];
    PidStat: {
        PID: number;
    };
    RegionInfo: {
        RegionFlagsExtended: Long;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
