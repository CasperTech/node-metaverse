/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TransferPacketMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    TransferData: {
        TransferID: UUID;
        ChannelType: number;
        Packet: number;
        Status: number;
        Data: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
