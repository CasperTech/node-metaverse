/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class GroupRoleUpdatePacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupID: UUID;
    };
    RoleData: {
        RoleID: UUID;
        Name: string;
        Description: string;
        Title: string;
        Powers: Long;
        UpdateType: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
