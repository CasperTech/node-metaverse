/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { Packet } from '../Packet';
export declare class SimStatusPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    SimStatus: {
        CanAcceptAgents: boolean;
        CanAcceptTasks: boolean;
    };
    SimFlags: {
        Flags: Long;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
