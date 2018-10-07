import { UUID } from './UUID';
import { AssetType } from '../enums/AssetType';
import { InventoryItem } from './InventoryItem';
import { Agent } from './Agent';
export declare class InventoryFolder {
    typeDefault: AssetType;
    version: number;
    name: string;
    folderID: UUID;
    parentID: UUID;
    items: InventoryItem[];
    cacheDir: string;
    agent: Agent;
    private inventoryBase;
    constructor(invBase: {
        skeleton: {
            [key: string]: InventoryFolder;
        };
        root?: UUID;
    }, agent: Agent);
    getChildFolders(): InventoryFolder[];
    private saveCache;
    private loadCache;
    populate(): Promise<{}>;
}
