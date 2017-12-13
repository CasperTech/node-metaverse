/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ReplyTaskInventoryPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    InventoryData: {
        TaskID: UUID;
        Serial: number;
        Filename: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
