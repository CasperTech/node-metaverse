/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ChildAgentAliveMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        RegionHandle: Long;
        ViewerCircuitCode: number;
        AgentID: UUID;
        SessionID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
