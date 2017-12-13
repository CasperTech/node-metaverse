/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class DirLandQueryBackendMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    QueryData: {
        QueryID: UUID;
        QueryFlags: number;
        SearchType: number;
        Price: number;
        Area: number;
        QueryStart: number;
        EstateID: number;
        Godlike: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
