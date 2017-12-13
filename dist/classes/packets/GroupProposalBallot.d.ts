/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class GroupProposalBallotPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ProposalData: {
        ProposalID: UUID;
        GroupID: UUID;
        VoteCast: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
