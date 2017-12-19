import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
import { AssetType } from '../enums/AssetType';
import { InventoryFolder } from './InventoryFolder';
export declare class Inventory {
    main: {
        skeleton: {
            [key: string]: InventoryFolder;
        };
        root?: UUID;
    };
    library: {
        owner?: UUID;
        skeleton: {
            [key: string]: InventoryFolder;
        };
        root?: UUID;
    };
    private clientEvents;
    constructor(clientEvents: ClientEvents);
    getRootFolderLibrary(): InventoryFolder;
    getRootFolderMain(): InventoryFolder;
    findFolderForType(type: AssetType): UUID;
}
