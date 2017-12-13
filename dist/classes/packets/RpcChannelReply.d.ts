/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class RpcChannelReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        TaskID: UUID;
        ItemID: UUID;
        ChannelID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
