/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class LiveHelpGroupReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ReplyData: {
        RequestID: UUID;
        GroupID: UUID;
        Selection: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
