import {UUID} from './UUID';
import {AssetType} from '../enums/AssetType';
import {InventoryItem} from './InventoryItem';
import {Inventory} from './Inventory';

export class InventoryFolder
{
    typeDefault: AssetType;
    version: number;
    name: string;
    folderID: UUID;
    parentID: UUID;
    items: InventoryItem[] = [];

    private inventoryBase: {
        skeleton:  {[key: string]: InventoryFolder},
        root?: UUID
    };

    constructor(invBase: {
        skeleton:  {[key: string]: InventoryFolder},
        root?: UUID
    })
    {
        this.inventoryBase = invBase;
    }

    getChildFolders(): InventoryFolder[]
    {
        const children: InventoryFolder[] = [];
        const ofi = this.folderID.toString();
        Object.keys(this.inventoryBase.skeleton).forEach((uuid) =>
        {
            const folder = this.inventoryBase.skeleton[uuid];
            if (folder.parentID.toString() === ofi)
            {
                children.push(folder);
            }
        });
        return children;
    }
}