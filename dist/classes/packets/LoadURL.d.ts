/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class LoadURLPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        ObjectName: string;
        ObjectID: UUID;
        OwnerID: UUID;
        OwnerIsGroup: boolean;
        Message: string;
        URL: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
