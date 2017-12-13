/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ImprovedInstantMessageMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    MessageBlock: {
        FromGroup: boolean;
        ToAgentID: UUID;
        ParentEstateID: number;
        RegionID: UUID;
        Position: Vector3;
        Offline: number;
        Dialog: number;
        ID: UUID;
        Timestamp: number;
        FromAgentName: Buffer;
        Message: Buffer;
        BinaryBucket: Buffer;
    };
    EstateBlock: {
        EstateID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
