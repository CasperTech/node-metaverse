/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ParcelObjectOwnersReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        OwnerID: UUID;
        IsGroupOwned: boolean;
        Count: number;
        OnlineStatus: boolean;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
