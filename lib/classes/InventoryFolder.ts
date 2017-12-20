import {UUID} from './UUID';
import {AssetType} from '../enums/AssetType';
import {InventoryItem} from './InventoryItem';
import * as fs from 'fs';
import * as path from 'path';
import * as LLSD from '@caspertech/llsd';
import {InventorySortOrder} from '../enums/InventorySortOrder';
import {Agent} from './Agent';

export class InventoryFolder
{
    typeDefault: AssetType;
    version: number;
    name: string;
    folderID: UUID;
    parentID: UUID;
    items: InventoryItem[] = [];
    cacheDir: string;
    agent: Agent;

    private inventoryBase: {
        skeleton:  {[key: string]: InventoryFolder},
        root?: UUID
    };

    constructor(invBase: {
        skeleton:  {[key: string]: InventoryFolder},
        root?: UUID
    }, agent: Agent)
    {
        this.agent = agent;
        this.inventoryBase = invBase;
        this.cacheDir = path.resolve(__dirname + '/cache/' + this.agent.agentID.toString());
        if (!fs.existsSync(this.cacheDir))
        {
            fs.mkdirSync(this.cacheDir, 0o777);
        }
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

    private saveCache(): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            const json = {
                version: this.version,
                items: this.items
            };
            const fileName = path.join(this.cacheDir + '/' + this.folderID.toString());
            fs.writeFile(fileName, JSON.stringify(json), (err) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve();
                }
            });
        });
    }

    private loadCache(): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            const fileName = path.join(this.cacheDir + '/' + this.folderID.toString());
            if (fs.existsSync(fileName))
            {
                fs.readFile(fileName, (err, data) =>
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        try
                        {
                            const json: any = JSON.parse(data.toString('utf8'));
                            if (json['version'] >= this.version)
                            {
                                this.items = [];
                                json['items'].forEach((item: any) =>
                                {
                                    item.created = new Date(item.created.mUUID);
                                    item.assetID = new UUID(item.assetID.mUUID);
                                    item.parentID = new UUID(item.parentID.mUUID);
                                    item.itemID = new UUID(item.itemID.mUUID);
                                    item.permissions.lastOwner = new UUID(item.permissions.lastOwner.mUUID);
                                    item.permissions.owner = new UUID(item.permissions.owner.mUUID);
                                    item.permissions.creator = new UUID(item.permissions.creator.mUUID);
                                    item.permissions.group = new UUID(item.permissions.group.mUUID);
                                    this.items.push(item);
                                });
                                resolve();
                            }
                            else
                            {
                                reject(new Error('Old version'));
                            }
                        }
                        catch (err)
                        {
                            reject(err);
                        }
                    }
                });
            }
            else
            {
                reject(new Error('Cache miss'));
            }
        });
    }

    populate()
    {
        return new Promise((resolve, reject) =>
        {
            this.loadCache().then(() =>
            {
                resolve();
            }).catch((err) =>
            {
                const requestFolder = {
                    folder_id: new LLSD.UUID(this.folderID),
                    owner_id: new LLSD.UUID(this.agent.agentID),
                    fetch_folders: true,
                    fetch_items: true,
                    sort_order: InventorySortOrder.ByName
                };
                const requestedFolders = {
                    'folders': [
                        requestFolder
                    ]
                };
                this.agent.currentRegion.caps.capsRequestXML('FetchInventoryDescendents2', requestedFolders).then((folderContents: any) =>
                {
                    if (folderContents['folders'] && folderContents['folders'][0] && folderContents['folders'][0]['items'])
                    {
                        this.version = folderContents['folders'][0]['version'];
                        this.items = [];
                        folderContents['folders'][0]['items'].forEach((item: any) =>
                        {
                            const invItem = new InventoryItem();
                            invItem.assetID = new UUID(item['asset_id'].toString());
                            invItem.inventoryType = item['inv_type'];
                            invItem.name = item['name'];
                            invItem.salePrice = item['sale_info']['sale_price'];
                            invItem.saleType = item['sale_info']['sale_type'];
                            invItem.created = new Date(item['created_at'] * 1000);
                            invItem.parentID = new UUID(item['parent_id'].toString());
                            invItem.flags = item['flags'];
                            invItem.itemID = new UUID(item['item_id'].toString());
                            invItem.description = item['desc'];
                            invItem.type = item['type'];
                            invItem.permissions = {
                                baseMask: item['permissions']['base_mask'],
                                groupMask: item['permissions']['group_mask'],
                                nextOwnerMask: item['permissions']['next_owner_mask'],
                                ownerMask: item['permissions']['owner_mask'],
                                everyoneMask: item['permissions']['everyone_mask'],
                                lastOwner: new UUID(item['permissions']['last_owner_id'].toString()),
                                owner: new UUID(item['permissions']['owner_id'].toString()),
                                creator: new UUID(item['permissions']['creator_id'].toString()),
                                group: new UUID(item['permissions']['group_id'].toString())
                            };
                            this.items.push(invItem);
                        });
                        this.saveCache().then(() =>
                        {
                            resolve();
                        }).catch(() =>
                        {
                            // Resolve anyway
                            resolve();
                        });
                    }
                    else
                    {
                        resolve();
                    }
                });
            });
        });
    }
}
