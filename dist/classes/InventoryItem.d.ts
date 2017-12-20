import { UUID } from './UUID';
import { InventoryType } from '../enums/InventoryType';
import { AssetType } from '../enums/AssetType';
import { InventoryItemFlags } from '../enums/InventoryItemFlags';
import { PermissionMask } from '../enums/PermissionMask';
export declare class InventoryItem {
    assetID: UUID;
    inventoryType: InventoryType;
    name: string;
    salePrice: number;
    saleType: number;
    created: Date;
    parentID: UUID;
    flags: InventoryItemFlags;
    itemID: UUID;
    description: string;
    type: AssetType;
    permissions: {
        baseMask: PermissionMask;
        groupMask: PermissionMask;
        nextOwnerMask: PermissionMask;
        ownerMask: PermissionMask;
        everyoneMask: PermissionMask;
        lastOwner: UUID;
        owner: UUID;
        creator: UUID;
        group: UUID;
    };
}
