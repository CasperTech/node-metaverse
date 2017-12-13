/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { Packet } from '../Packet';
export declare class ScriptDataReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        Hash: Long;
        Reply: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
