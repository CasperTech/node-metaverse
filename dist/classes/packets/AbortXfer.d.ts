/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class AbortXferPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    XferID: {
        ID: Long;
        Result: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
