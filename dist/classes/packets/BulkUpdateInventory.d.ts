/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class BulkUpdateInventoryPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        TransactionID: UUID;
    };
    FolderData: {
        FolderID: UUID;
        ParentID: UUID;
        Type: number;
        Name: string;
    }[];
    ItemData: {
        ItemID: UUID;
        CallbackID: number;
        FolderID: UUID;
        CreatorID: UUID;
        OwnerID: UUID;
        GroupID: UUID;
        BaseMask: number;
        OwnerMask: number;
        GroupMask: number;
        EveryoneMask: number;
        NextOwnerMask: number;
        GroupOwned: boolean;
        AssetID: UUID;
        Type: number;
        InvType: number;
        Flags: number;
        SaleType: number;
        SalePrice: number;
        Name: string;
        Description: string;
        CreationDate: number;
        CRC: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
