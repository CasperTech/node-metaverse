/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ObjectPropertiesMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
        Name: Buffer;
        Description: Buffer;
        TouchName: Buffer;
        SitName: Buffer;
        TextureID: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
