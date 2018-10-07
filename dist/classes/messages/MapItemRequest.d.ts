/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class MapItemRequestMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        Flags: number;
        EstateID: number;
        Godlike: boolean;
    };
    RequestData: {
        ItemType: number;
        RegionHandle: Long;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
