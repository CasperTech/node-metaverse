import { UUID } from './UUID';
import { InventoryFolder } from './InventoryFolder';
import type { Agent } from './Agent';
import * as LLSD from '@caspertech/llsd';
import { InventoryItem } from './InventoryItem';
import type { FolderType } from '../enums/FolderType';
import { InventoryLibrary } from '../enums/InventoryLibrary';

export class Inventory
{
    public main: {
        skeleton:  Map<string, InventoryFolder>,
        root?: UUID
    } = {
        skeleton: new Map<string, InventoryFolder>()
    };

    public library: {
        owner?: UUID,
        skeleton: Map<string, InventoryFolder>,
        root?: UUID
    } = {
        skeleton: new Map<string, InventoryFolder>()
    };

    public itemsByID = new Map<string, InventoryItem>();

    private readonly agent: Agent;

    public constructor(agent: Agent)
    {
        this.agent = agent;
    }

    public getRootFolderLibrary(): InventoryFolder
    {
        if (this.library.root === undefined)
        {
            return new InventoryFolder(InventoryLibrary.Library, this.library, this.agent);
        }
        const uuidStr = this.library.root.toString();
        const skel = this.library.skeleton.get(uuidStr);
        if (skel)
        {
            return skel;
        }
        else
        {
            return new InventoryFolder(InventoryLibrary.Library, this.library, this.agent);
        }
    }
    public getRootFolderMain(): InventoryFolder
    {
        if (this.main.root === undefined)
        {
            return new InventoryFolder(InventoryLibrary.Main, this.main, this.agent);
        }
        const uuidStr = this.main.root.toString();
        const skel = this.main.skeleton.get(uuidStr);
        if (skel)
        {
            return skel;
        }
        else
        {
            return new InventoryFolder(InventoryLibrary.Main, this.main, this.agent);
        }
    }

    public findFolderForType(type: FolderType): UUID
    {
        const root = this.main.skeleton;
        for (const f of root.values())
        {
            if (f !== undefined && f.typeDefault === type)
            {
                return f.folderID;
            }
        }
        return this.getRootFolderMain().folderID;
    }

    public findFolder(folderID: UUID): InventoryFolder | null
    {
        const fol = this.main.skeleton.get(folderID.toString());
        if (fol !== undefined)
        {
            return fol;
        }
        for (const folder of this.main.skeleton.values())
        {
            const result = folder.findFolder(folderID);
            if (result !== null)
            {
                return result;
            }
        }
        return null;
    }

    public async fetchInventoryItem(item: UUID): Promise<InventoryItem | null>
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
        if (response.items.length > 0)
        {
            const receivedItem = response.items[0];
            let folder = this.findFolder(new UUID(receivedItem.parent_id.toString()));
            if (folder === null)
            {
                folder = this.getRootFolderMain();
            }
            const invItem = new InventoryItem(folder, this.agent);
            invItem.assetID = new UUID(receivedItem.asset_id.toString());
            invItem.inventoryType = parseInt(receivedItem.inv_type, 10);
            invItem.type = parseInt(receivedItem.type, 10);
            invItem.itemID = item;

            if (receivedItem.permissions.last_owner_id === undefined)
            {
                // TODO: OpenSim glitch
                receivedItem.permissions.last_owner_id = receivedItem.permissions.owner_id;
            }

            invItem.permissions = {
                baseMask: parseInt(receivedItem.permissions.base_mask, 10),
                nextOwnerMask: parseInt(receivedItem.permissions.next_owner_mask, 10),
                groupMask: parseInt(receivedItem.permissions.group_mask, 10),
                lastOwner: new UUID(receivedItem.permissions.last_owner_id.toString()),
                owner: new UUID(receivedItem.permissions.owner_id.toString()),
                creator: new UUID(receivedItem.permissions.creator_id.toString()),
                group: new UUID(receivedItem.permissions.group_id.toString()),
                ownerMask: parseInt(receivedItem.permissions.owner_mask, 10),
                everyoneMask: parseInt(receivedItem.permissions.everyone_mask, 10),
            };
            invItem.flags = parseInt(receivedItem.flags, 10);
            invItem.description = receivedItem.desc;
            invItem.name = receivedItem.name;
            invItem.created = new Date(receivedItem.created_at * 1000);
            invItem.parentID = new UUID(receivedItem.parent_id.toString());
            invItem.saleType = parseInt(receivedItem.sale_info.sale_type, 10);
            invItem.salePrice = parseInt(receivedItem.sale_info.sale_price, 10);
            const skel = this.main.skeleton.get(invItem.parentID.toString());
            if (skel !== undefined)
            {
                await skel.addItem(invItem);
            }
            return invItem;
        }
        else
        {
            return null;
        }
    }
}
