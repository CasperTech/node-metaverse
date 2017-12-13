/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class GroupNoticeAddPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    MessageBlock: {
        ToGroupID: UUID;
        ID: UUID;
        Dialog: number;
        FromAgentName: string;
        Message: string;
        BinaryBucket: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
