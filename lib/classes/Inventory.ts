import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
import { InventoryFolder } from './InventoryFolder';
import { Agent } from './Agent';
import * as LLSD from '@caspertech/llsd';
import { InventoryItem } from './InventoryItem';
import { FolderType } from '../enums/FolderType';

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

    itemsByID: {[key: string]: InventoryItem} = {};

    private clientEvents: ClientEvents;
    private agent: Agent;

    constructor(clientEvents: ClientEvents, agent: Agent)
    {
        this.agent = agent;
        this.clientEvents = clientEvents;
    }
    getRootFolderLibrary(): InventoryFolder
    {
        if (this.library.root === undefined)
        {
            return new InventoryFolder(this.library, this.agent);
        }
        const uuidStr = this.library.root.toString();
        if (this.library.skeleton[uuidStr])
        {
            return this.library.skeleton[uuidStr];
        }
        else
        {
            return new InventoryFolder(this.library, this.agent);
        }
    }
    getRootFolderMain(): InventoryFolder
    {
        if (this.main.root === undefined)
        {
            return new InventoryFolder(this.main, this.agent);
        }
        const uuidStr = this.main.root.toString();
        if (this.main.skeleton[uuidStr])
        {
            return this.main.skeleton[uuidStr];
        }
        else
        {
            return new InventoryFolder(this.main, this.agent);
        }
    }
    findFolderForType(type: FolderType): UUID
    {
        const root = this.main.skeleton;
        for (const key of Object.keys(root))
        {
            const f = root[key];
            if (f.typeDefault === type)
            {
                return f.folderID;
            }
        }
        return this.getRootFolderMain().folderID;
    }

    findFolder(folderID: UUID): InventoryFolder | null
    {
        for (const id of Object.keys(this.main.skeleton))
        {
            if (folderID.equals(id))
            {
                return this.main.skeleton[id];
            }
            else
            {
                const result = this.main.skeleton[id].findFolder(folderID);
                if (result !== null)
                {
                    return result;
                }
            }
        }
        return null;
    }

    async fetchInventoryItem(item: UUID): Promise<InventoryItem | null>
    {
        const params = {
            'agent_id': new LLSD.UUID(this.agent.agentID),
            'items': [
                {
                    'item_id': new LLSD.UUID(item),
                    'owner_id': new LLSD.UUID(this.agent.agentID)
                }
            ]
        };
        const response = await this.agent.currentRegion.caps.capsPostXML('FetchInventory2', params);
        if (response['items'].length > 0)
        {
            const receivedItem = response['items'][0];
            let folder = await this.findFolder(new UUID(receivedItem['parent_id'].toString()));
            if (folder === null)
            {
                folder = this.getRootFolderMain();
            }
            const invItem = new InventoryItem(folder, this.agent);
            invItem.assetID = new UUID(receivedItem['asset_id'].toString());
            invItem.inventoryType = parseInt(receivedItem['inv_type'], 10);
            invItem.type = parseInt(receivedItem['type'], 10);
            invItem.itemID = item;

            if (receivedItem['permissions']['last_owner_id'] === undefined)
            {
                // TODO: OpenSim glitch
                receivedItem['permissions']['last_owner_id'] = receivedItem['permissions']['owner_id'];
            }

            invItem.permissions = {
                baseMask: parseInt(receivedItem['permissions']['base_mask'], 10),
                nextOwnerMask: parseInt(receivedItem['permissions']['next_owner_mask'], 10),
                groupMask: parseInt(receivedItem['permissions']['group_mask'], 10),
                lastOwner: new UUID(receivedItem['permissions']['last_owner_id'].toString()),
                owner: new UUID(receivedItem['permissions']['owner_id'].toString()),
                creator: new UUID(receivedItem['permissions']['creator_id'].toString()),
                group: new UUID(receivedItem['permissions']['group_id'].toString()),
                ownerMask: parseInt(receivedItem['permissions']['owner_mask'], 10),
                everyoneMask: parseInt(receivedItem['permissions']['everyone_mask'], 10),
            };
            invItem.flags = parseInt(receivedItem['flags'], 10);
            invItem.description = receivedItem['desc'];
            invItem.name = receivedItem['name'];
            invItem.created = new Date(receivedItem['created_at'] * 1000);
            invItem.parentID = new UUID(receivedItem['parent_id'].toString());
            invItem.saleType = parseInt(receivedItem['sale_info']['sale_type'], 10);
            invItem.salePrice = parseInt(receivedItem['sale_info']['sale_price'], 10);
            if (this.main.skeleton[invItem.parentID.toString()])
            {
                await this.main.skeleton[invItem.parentID.toString()].addItem(invItem);
            }
            return invItem;
        }
        else
        {
            return null;
        }
    }
}
