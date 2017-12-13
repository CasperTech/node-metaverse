/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class DirPlacesReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    QueryData: {
        QueryID: UUID;
    }[];
    QueryReplies: {
        ParcelID: UUID;
        Name: string;
        ForSale: boolean;
        Auction: boolean;
        Dwell: number;
    }[];
    StatusData: {
        Status: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
