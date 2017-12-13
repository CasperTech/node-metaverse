/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SetSimStatusInDatabaseMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Data: {
        RegionID: UUID;
        HostName: Buffer;
        X: number;
        Y: number;
        PID: number;
        AgentCount: number;
        TimeToLive: number;
        Status: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
