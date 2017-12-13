/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class KickUserAckPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    UserInfo: {
        SessionID: UUID;
        Flags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
