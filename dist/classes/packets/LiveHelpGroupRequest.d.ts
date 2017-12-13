/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class LiveHelpGroupRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    RequestData: {
        RequestID: UUID;
        AgentID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
