/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class UpdateCreateInventoryItemPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SimApproved: boolean;
        TransactionID: UUID;
    };
    InventoryData: {
        ItemID: UUID;
        FolderID: UUID;
        CallbackID: number;
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
