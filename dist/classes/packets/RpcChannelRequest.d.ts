/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class RpcChannelRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        GridX: number;
        GridY: number;
        TaskID: UUID;
        ItemID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
