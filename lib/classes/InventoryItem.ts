import {UUID} from './UUID';
import {InventoryType} from '../enums/InventoryType';
import {PermissionMask} from '../enums/PermissionMask';
import {AssetType, InventoryItemFlags} from '..';

export class InventoryItem
{
    assetID: UUID = UUID.zero();;
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
        groupOwned?: boolean
    } = {
        baseMask: 0,
        groupMask: 0,
        nextOwnerMask: 0,
        ownerMask: 0,
        everyoneMask: 0,
        lastOwner: UUID.zero(),
        owner: UUID.zero(),
        creator: UUID.zero(),
        group: UUID.zero(),
        groupOwned: false
    };
}