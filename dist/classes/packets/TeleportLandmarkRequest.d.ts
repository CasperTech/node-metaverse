/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class TeleportLandmarkRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Info: {
        AgentID: UUID;
        SessionID: UUID;
        LandmarkID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
