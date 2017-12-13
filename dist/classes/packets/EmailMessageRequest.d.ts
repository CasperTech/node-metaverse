/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class EmailMessageRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        ObjectID: UUID;
        FromAddress: string;
        Subject: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
