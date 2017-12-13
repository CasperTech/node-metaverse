/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class RegionIDAndHandleReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ReplyBlock: {
        RegionID: UUID;
        RegionHandle: Long;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
