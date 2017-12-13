/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class GroupDataUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentGroupData: {
        AgentID: UUID;
        GroupID: UUID;
        AgentPowers: Long;
        GroupTitle: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
