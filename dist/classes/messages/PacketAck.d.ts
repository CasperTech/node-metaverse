/// <reference types="node" />
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class PacketAckMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    Packets: {
        ID: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}