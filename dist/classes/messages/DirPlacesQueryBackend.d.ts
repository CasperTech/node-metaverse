/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class DirPlacesQueryBackendMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    QueryData: {
        QueryID: UUID;
        QueryText: Buffer;
        QueryFlags: number;
        Category: number;
        SimName: Buffer;
        EstateID: number;
        Godlike: boolean;
        QueryStart: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
