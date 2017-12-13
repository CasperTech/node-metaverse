/// <reference types="long" />
/// <reference types="node" />
import { IPAddress } from '../IPAddress';
import Long = require('long');
import { Packet } from '../Packet';
export declare class EnableSimulatorPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    SimulatorInfo: {
        Handle: Long;
        IP: IPAddress;
        Port: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
