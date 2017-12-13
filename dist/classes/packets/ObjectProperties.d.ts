/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class ObjectPropertiesPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ObjectData: {
        ObjectID: UUID;
        CreatorID: UUID;
        OwnerID: UUID;
        GroupID: UUID;
        CreationDate: Long;
        BaseMask: number;
        OwnerMask: number;
        GroupMask: number;
        EveryoneMask: number;
        NextOwnerMask: number;
        OwnershipCost: number;
        SaleType: number;
        SalePrice: number;
        AggregatePerms: number;
        AggregatePermTextures: number;
        AggregatePermTexturesOwner: number;
        Category: number;
        InventorySerial: number;
        ItemID: UUID;
        FolderID: UUID;
        FromTaskID: UUID;
        LastOwnerID: UUID;
        Name: string;
        Description: string;
        TouchName: string;
        SitName: string;
        TextureID: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
