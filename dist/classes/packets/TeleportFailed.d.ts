/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class TeleportFailedPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Info: {
        AgentID: UUID;
        Reason: string;
    };
    AlertInfo: {
        Message: string;
        ExtraParams: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
