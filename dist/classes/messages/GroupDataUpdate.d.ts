/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GroupDataUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentGroupData: {
        AgentID: UUID;
        GroupID: UUID;
        AgentPowers: Long;
        GroupTitle: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
