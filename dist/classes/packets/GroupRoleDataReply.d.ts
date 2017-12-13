/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class GroupRoleDataReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    GroupData: {
        GroupID: UUID;
        RequestID: UUID;
        RoleCount: number;
    };
    RoleData: {
        RoleID: UUID;
        Name: string;
        Title: string;
        Description: string;
        Powers: Long;
        Members: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
