/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class RpcScriptRequestInboundMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    TargetBlock: {
        GridX: number;
        GridY: number;
    };
    DataBlock: {
        TaskID: UUID;
        ItemID: UUID;
        ChannelID: UUID;
        IntValue: number;
        StringValue: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
