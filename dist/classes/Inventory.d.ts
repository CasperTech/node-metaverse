import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
import { AssetType } from '../enums/AssetType';
import { InventoryFolder } from './InventoryFolder';
import { Agent } from './Agent';
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
    private agent;
    constructor(clientEvents: ClientEvents, agent: Agent);
    getRootFolderLibrary(): InventoryFolder;
    getRootFolderMain(): InventoryFolder;
    findFolderForType(type: AssetType): UUID;
}
