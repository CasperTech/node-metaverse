/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class LogDwellTimeMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    DwellInfo: {
        AgentID: UUID;
        SessionID: UUID;
        Duration: number;
        SimName: Buffer;
        RegionX: number;
        RegionY: number;
        AvgAgentsInView: number;
        AvgViewerFPS: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
