/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ScriptRunningReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Script: {
        ObjectID: UUID;
        ItemID: UUID;
        Running: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
