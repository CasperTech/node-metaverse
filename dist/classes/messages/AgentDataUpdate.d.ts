/// <reference types="node" />
/// <reference types="long" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AgentDataUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        FirstName: Buffer;
        LastName: Buffer;
        GroupTitle: Buffer;
        ActiveGroupID: UUID;
        GroupPowers: Long;
        GroupName: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
