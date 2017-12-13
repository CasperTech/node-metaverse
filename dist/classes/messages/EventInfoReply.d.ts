/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class EventInfoReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    EventData: {
        EventID: number;
        Creator: Buffer;
        Name: Buffer;
        Category: Buffer;
        Desc: Buffer;
        Date: Buffer;
        DateUTC: number;
        Duration: number;
        Cover: number;
        Amount: number;
        SimName: Buffer;
        GlobalPos: Vector3;
        EventFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
