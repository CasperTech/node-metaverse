/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ParcelAccessListReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Data: {
        AgentID: UUID;
        SequenceID: number;
        Flags: number;
        LocalID: number;
    };
    List: {
        ID: UUID;
        Time: number;
        Flags: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
