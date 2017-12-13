/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SetSimPresenceInDatabaseMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    SimData: {
        RegionID: UUID;
        HostName: Buffer;
        GridX: number;
        GridY: number;
        PID: number;
        AgentCount: number;
        TimeToLive: number;
        Status: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
