/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class TransferRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TransferInfo: {
        TransferID: UUID;
        ChannelType: number;
        SourceType: number;
        Priority: number;
        Params: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
