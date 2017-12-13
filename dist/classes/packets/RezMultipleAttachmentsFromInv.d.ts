/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class RezMultipleAttachmentsFromInvPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    HeaderData: {
        CompoundMsgID: UUID;
        TotalObjects: number;
        FirstDetachAll: boolean;
    };
    ObjectData: {
        ItemID: UUID;
        OwnerID: UUID;
        AttachmentPt: number;
        ItemFlags: number;
        GroupMask: number;
        EveryoneMask: number;
        NextOwnerMask: number;
        Name: string;
        Description: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
