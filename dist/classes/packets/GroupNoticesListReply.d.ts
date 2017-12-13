/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class GroupNoticesListReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        GroupID: UUID;
    };
    Data: {
        NoticeID: UUID;
        Timestamp: number;
        FromName: string;
        Subject: string;
        HasAttachment: boolean;
        AssetType: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
