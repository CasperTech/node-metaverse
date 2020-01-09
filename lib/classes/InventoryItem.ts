import { UUID } from './UUID';
import { InventoryType } from '../enums/InventoryType';
import { PermissionMask } from '../enums/PermissionMask';
import { InventoryItemFlags } from '../enums/InventoryItemFlags';
import { AssetType } from '../enums/AssetType';

export class InventoryItem
{
    assetID: UUID = UUID.zero();
    inventoryType: InventoryType;
    name: string;
    salePrice: number;
    saleType: number;
    created: Date;
    parentID: UUID;
    flags: InventoryItemFlags;
    itemID: UUID;
    oldItemID?: UUID;
    parentPartID?: UUID;
    permsGranter?: UUID;
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

    getCRC(): number
    {
        let crc = 0;
        crc = crc + this.itemID.CRC() >>> 0;
        crc = crc + this.parentID.CRC() >>> 0;
        crc = crc + this.permissions.creator.CRC() >>> 0;
        crc = crc + this.permissions.owner.CRC() >>> 0;
        crc = crc + this.permissions.group.CRC() >>> 0;
        crc = crc + this.permissions.baseMask >>> 0;
        crc = crc + this.permissions.ownerMask >>> 0;
        crc = crc + this.permissions.everyoneMask >>> 0;
        crc = crc + this.permissions.groupMask >>> 0;

        crc = crc + this.assetID.CRC() >>> 0;
        crc = crc + this.type >>> 0;
        crc = crc + this.inventoryType >>> 0;

        crc = crc + this.flags >>> 0;
        crc = crc + this.salePrice >>> 0;
        crc = crc + (this.saleType * 0x07073096 >>> 0) >>> 0;
        crc = crc + Math.round(this.created.getTime() / 1000) >>> 0;
        return crc;
    }
}
