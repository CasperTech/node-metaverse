/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class CreateGroupRequestExtendedPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupLimit: number;
    };
    GroupData: {
        Name: string;
        Charter: string;
        ShowInList: boolean;
        InsigniaID: UUID;
        MembershipFee: number;
        OpenEnrollment: boolean;
        AllowPublish: boolean;
        MaturePublish: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
