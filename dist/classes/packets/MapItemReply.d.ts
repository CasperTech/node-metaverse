/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MapItemReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        Flags: number;
    };
    RequestData: {
        ItemType: number;
    };
    Data: {
        X: number;
        Y: number;
        ID: UUID;
        Extra: number;
        Extra2: number;
        Name: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
