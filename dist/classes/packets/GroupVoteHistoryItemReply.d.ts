/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class GroupVoteHistoryItemReplyPacket implements Packet {
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
    HistoryItemData: {
        VoteID: UUID;
        TerseDateID: string;
        StartDateTime: string;
        EndDateTime: string;
        VoteInitiator: UUID;
        VoteType: string;
        VoteResult: string;
        Majority: number;
        Quorum: number;
        ProposalText: string;
    };
    VoteItem: {
        CandidateID: UUID;
        VoteCast: string;
        NumVotes: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
