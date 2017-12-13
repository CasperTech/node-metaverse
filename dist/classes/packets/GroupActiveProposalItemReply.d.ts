/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class GroupActiveProposalItemReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        GroupID: UUID;
    };
    TransactionData: {
        TransactionID: UUID;
        TotalNumItems: number;
    };
    ProposalData: {
        VoteID: UUID;
        VoteInitiator: UUID;
        TerseDateID: string;
        StartDateTime: string;
        EndDateTime: string;
        AlreadyVoted: boolean;
        VoteCast: string;
        Majority: number;
        Quorum: number;
        ProposalText: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
