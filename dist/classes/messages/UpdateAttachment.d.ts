/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class UpdateAttachmentMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    AttachmentBlock: {
        AttachmentPoint: number;
    };
    OperationData: {
        AddItem: boolean;
        UseExistingAsset: boolean;
    };
    InventoryData: {
        ItemID: UUID;
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
        Name: Buffer;
        Description: Buffer;
        CreationDate: number;
        CRC: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
