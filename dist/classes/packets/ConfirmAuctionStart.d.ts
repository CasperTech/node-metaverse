/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ConfirmAuctionStartPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AuctionData: {
        ParcelID: UUID;
        AuctionID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
