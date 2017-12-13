/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class TransferAbortPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TransferInfo: {
        TransferID: UUID;
        ChannelType: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
