/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class GodKickUserPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    UserInfo: {
        GodID: UUID;
        GodSessionID: UUID;
        AgentID: UUID;
        KickFlags: number;
        Reason: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
