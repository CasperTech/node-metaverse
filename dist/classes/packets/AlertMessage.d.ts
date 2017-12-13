/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AlertMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AlertData: {
        Message: string;
    };
    AlertInfo: {
        Message: string;
        ExtraParams: string;
    }[];
    AgentInfo: {
        AgentID: UUID;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
