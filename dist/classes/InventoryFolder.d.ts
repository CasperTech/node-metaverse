import { UUID } from './UUID';
import { AssetType } from '../enums/AssetType';
import { InventoryItem } from './InventoryItem';
export declare class InventoryFolder {
    typeDefault: AssetType;
    version: number;
    name: string;
    folderID: UUID;
    parentID: UUID;
    items: InventoryItem[];
    private inventoryBase;
    constructor(invBase: {
        skeleton: {
            [key: string]: InventoryFolder;
        };
        root?: UUID;
    });
    getChildFolders(): InventoryFolder[];
}
