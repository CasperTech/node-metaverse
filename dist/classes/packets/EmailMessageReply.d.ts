/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class EmailMessageReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        ObjectID: UUID;
        More: number;
        Time: number;
        FromAddress: string;
        Subject: string;
        Data: string;
        MailFilter: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
