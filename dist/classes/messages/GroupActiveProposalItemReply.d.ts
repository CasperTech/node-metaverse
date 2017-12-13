/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GroupActiveProposalItemReplyMessage implements MessageBase {
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
    ProposalData: {
        VoteID: UUID;
        VoteInitiator: UUID;
        TerseDateID: Buffer;
        StartDateTime: Buffer;
        EndDateTime: Buffer;
        AlreadyVoted: boolean;
        VoteCast: Buffer;
        Majority: number;
        Quorum: number;
        ProposalText: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
