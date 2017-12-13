/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class TeleportLureRequestPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    Info: {
        AgentID: UUID;
        SessionID: UUID;
        LureID: UUID;
        TeleportFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
