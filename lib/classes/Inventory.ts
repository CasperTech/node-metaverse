import {UUID} from './UUID';
import {ClientEvents} from './ClientEvents';
import {AssetType} from '../enums/AssetType';

export class Inventory
{
    main: {
        skeleton: {
            typeDefault: AssetType,
            version: number,
            name: string,
            folderID: UUID,
            parentID: UUID
        }[],
        root?: UUID
    } = {
        skeleton: []
    };
    library: {
        owner?: UUID,
        skeleton: {
            typeDefault: number,
            version: number,
            name: string,
            folderID: UUID,
            parentID: UUID
        }[],
        root?: UUID
    } = {
        skeleton: []
    };
    private clientEvents: ClientEvents;

    constructor(clientEvents: ClientEvents)
    {
        this.clientEvents = clientEvents;
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
        this.main.skeleton.forEach((folder) =>
        {
            if (folder.typeDefault === type)
            {
                found = folder.folderID;
            }
        });
        return found;
    }
}
