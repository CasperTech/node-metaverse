/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TeleportLocalMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Info: {
        AgentID: UUID;
        LocationID: number;
        Position: Vector3;
        LookAt: Vector3;
        TeleportFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
