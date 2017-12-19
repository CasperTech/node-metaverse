import {UUID} from './UUID';
import {ClientEvents} from './ClientEvents';
import {AssetType} from '../enums/AssetType';
import {InventoryFolder} from './InventoryFolder';
import uuid = require('uuid');

export class Inventory
{
    main: {
        skeleton:  {[key: string]: InventoryFolder},
        root?: UUID
    } = {
        skeleton: {}
    };
    library: {
        owner?: UUID,
        skeleton: {[key: string]: InventoryFolder},
        root?: UUID
    } = {
        skeleton: {}
    };
    private clientEvents: ClientEvents;

    constructor(clientEvents: ClientEvents)
    {
        this.clientEvents = clientEvents;
    }
    getRootFolderLibrary(): InventoryFolder
    {
        if (this.library.root === undefined)
        {
            return new InventoryFolder(this.library);
        }
        const uuidStr = this.library.root.toString();
        if (this.library.skeleton[uuidStr])
        {
            return this.library.skeleton[uuidStr];
        }
        else
        {
            return new InventoryFolder(this.library);
        }
    }
    getRootFolderMain(): InventoryFolder
    {
        if (this.main.root === undefined)
        {
            return new InventoryFolder(this.main);
        }
        const uuidStr = this.main.root.toString();
        if (this.main.skeleton[uuidStr])
        {
            return this.main.skeleton[uuidStr];
        }
        else
        {
            return new InventoryFolder(this.main);
        }
    }
    findFolderForType(type: AssetType): UUID
    {
        if (this.main.root === undefined)
        {
            return UUID.zero();
        }
        if (type === AssetType.Folder)
        {
            return this.main.root;
        }
        let found = UUID.zero();
        Object.keys(this.main.skeleton).forEach((uuid) =>
        {
            const folder = this.main.skeleton[uuid];
            if (folder.typeDefault === type)
            {
                found = folder.folderID;
            }
        });
        return found;
    }
}
