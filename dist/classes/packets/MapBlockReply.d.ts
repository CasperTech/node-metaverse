/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MapBlockReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        Flags: number;
    };
    Data: {
        X: number;
        Y: number;
        Name: string;
        Access: number;
        RegionFlags: number;
        WaterHeight: number;
        Agents: number;
        MapImageID: UUID;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
