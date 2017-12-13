/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class StartGroupProposalPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ProposalData: {
        GroupID: UUID;
        Quorum: number;
        Majority: number;
        Duration: number;
        ProposalText: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
