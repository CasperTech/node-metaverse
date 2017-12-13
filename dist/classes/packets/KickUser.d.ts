/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { Packet } from '../Packet';
export declare class KickUserPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TargetBlock: {
        TargetIP: IPAddress;
        TargetPort: number;
    };
    UserInfo: {
        AgentID: UUID;
        SessionID: UUID;
        Reason: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
