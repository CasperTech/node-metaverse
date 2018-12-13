import {UUID} from './UUID';
import {InventoryType} from '../enums/InventoryType';
import {PermissionMask} from '../enums/PermissionMask';
import {AssetType, InventoryItemFlags} from '..';

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
        crc += this.assetID.CRC();
        crc += this.parentID.CRC();
        crc += this.itemID.CRC();
        crc += this.permissions.creator.CRC();
        crc += this.permissions.owner.CRC();
        crc += this.permissions.group.CRC();
        crc += this.permissions.ownerMask;
        crc += this.permissions.nextOwnerMask;
        crc += this.permissions.everyoneMask;
        crc += this.permissions.groupMask;
        crc += this.flags;
        crc += this.inventoryType;
        crc += this.type;
        crc += Math.round(this.created.getTime() / 1000);
        crc += this.salePrice;
        crc += this.saleType * 0x07073096;
        while (crc > 4294967295)
        {
            crc -= 4294967295;
        }
        return crc;
    }
}
