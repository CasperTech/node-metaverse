/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TeleportLandmarkRequestMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Info: {
        AgentID: UUID;
        SessionID: UUID;
        LandmarkID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
