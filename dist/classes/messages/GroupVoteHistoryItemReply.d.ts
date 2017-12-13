/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GroupVoteHistoryItemReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
        TerseDateID: Buffer;
        StartDateTime: Buffer;
        EndDateTime: Buffer;
        VoteInitiator: UUID;
        VoteType: Buffer;
        VoteResult: Buffer;
        Majority: number;
        Quorum: number;
        ProposalText: Buffer;
    };
    VoteItem: {
        CandidateID: UUID;
        VoteCast: Buffer;
        NumVotes: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
