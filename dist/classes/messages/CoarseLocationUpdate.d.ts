/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class CoarseLocationUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Location: {
        X: number;
        Y: number;
        Z: number;
    }[];
    Index: {
        You: number;
        Prey: number;
    };
    AgentData: {
        AgentID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
