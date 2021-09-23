import * as LLSD from '@caspertech/llsd';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AssetType } from '../enums/AssetType';
import { FilterResponse } from '../enums/FilterResponse';
import { FolderType } from '../enums/FolderType';
import { InventoryItemFlags } from '../enums/InventoryItemFlags';
import { InventoryLibrary } from '../enums/InventoryLibrary';
import { InventorySortOrder } from '../enums/InventorySortOrder';
import { InventoryType } from '../enums/InventoryType';
import { Message } from '../enums/Message';
import { PacketFlags } from '../enums/PacketFlags';
import { PermissionMask } from '../enums/PermissionMask';
import { WearableType } from '../enums/WearableType';
import { Agent } from './Agent';
import { InventoryItem } from './InventoryItem';
import { LLWearable } from './LLWearable';
import { Logger } from './Logger';
import { AssetUploadRequestMessage } from './messages/AssetUploadRequest';
import { CreateInventoryFolderMessage } from './messages/CreateInventoryFolder';
import { CreateInventoryItemMessage } from './messages/CreateInventoryItem';
import { RequestXferMessage } from './messages/RequestXfer';
import { UpdateCreateInventoryItemMessage } from './messages/UpdateCreateInventoryItem';
import { LLMesh } from './public/LLMesh';
import { Utils } from './Utils';
import { UUID } from './UUID';

export class InventoryFolder
{
    typeDefault: FolderType;
    version: number;
    name: string;
    folderID: UUID;
    parentID: UUID;
    items: InventoryItem[] = [];
    folders: InventoryFolder[] = [];
    cacheDir: string;
    agent: Agent;
    library: InventoryLibrary;

    private callbackID = 1;

    private inventoryBase: {
        skeleton:  {[key: string]: InventoryFolder},
        root?: UUID
    };

    constructor(lib: InventoryLibrary,
                invBase: {
        skeleton:  {[key: string]: InventoryFolder},
        root?: UUID
    }, agent: Agent)
    {
        this.agent = agent;
        this.library = lib;
        this.inventoryBase = invBase;
        const cacheLocation = path.resolve(__dirname + '/cache');
        if (!fsSync.existsSync(cacheLocation))
        {
            fsSync.mkdirSync(cacheLocation, 0o777);
        }
        this.cacheDir = path.resolve(cacheLocation + '/' + this.agent.agentID.toString());
        if (!fsSync.existsSync(this.cacheDir))
        {
            fsSync.mkdirSync(this.cacheDir, 0o777);
        }
    }

    getChildFolders(): InventoryFolder[]
    {
        const children: InventoryFolder[] = [];
        const ofi = this.folderID.toString();
        for (const uuid of Object.keys(this.inventoryBase.skeleton))
        {
            const folder = this.inventoryBase.skeleton[uuid];
            if (folder.parentID.toString() === ofi)
            {
                children.push(folder);
            }
        }
        return children;
    }

    getChildFoldersRecursive(): InventoryFolder[]
    {
        const children: InventoryFolder[] = [];
        const toBrowse: UUID[] = [this.folderID];
        while (toBrowse.length > 0)
        {
            const uuid = toBrowse.pop();
            if (!uuid)
            {
                break;
            }
            const folder = this.inventoryBase.skeleton[uuid.toString()]
            if (folder)
            {

                for (const child of folder.getChildFolders())
                {
                    children.push(child);
                    toBrowse.push(child.folderID)
                }
            }
        }
        return children;
    }

    async createFolder(name: string, type: FolderType): Promise<InventoryFolder>
    {
        const msg = new CreateInventoryFolderMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.agent.currentRegion.circuit.sessionID
        };
        msg.FolderData = {
            FolderID: UUID.random(),
            ParentID: this.folderID,
            Type: type,
            Name: Utils.StringToBuffer(name),
        };
        const ack = this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.agent.currentRegion.circuit.waitForAck(ack, 10000);

        const requestFolder = {
            folder_id: new LLSD.UUID(this.folderID),
            owner_id: new LLSD.UUID(this.agent.agentID),
            fetch_folders: true,
            fetch_items: false,
            sort_order: InventorySortOrder.ByName
        };
        const requestedFolders = {
            'folders': [
                requestFolder
            ]
        };

        let cmd = 'FetchInventoryDescendents2';
        if (this.library === InventoryLibrary.Library)
        {
            cmd = 'FetchLibDescendents2';
        }

        const folderContents: any = await this.agent.currentRegion.caps.capsPostXML(cmd, requestedFolders);
        if (folderContents['folders'] && folderContents['folders'][0] && folderContents['folders'][0]['categories'] && folderContents['folders'][0]['categories'].length > 0)
        {
            for (const folder of folderContents['folders'][0]['categories'])
            {
                let folderID = folder['category_id'];
                if (folderID === undefined)
                {
                    folderID = folder['folder_id'];
                }
                if (folderID === undefined)
                {
                    continue;
                }
                const foundFolderID = new UUID(folderID.toString());
                if (foundFolderID.equals(msg.FolderData.FolderID))
                {
                    const newFolder = new InventoryFolder(this.library, this.agent.inventory.main, this.agent);
                    newFolder.typeDefault = parseInt(folder['type_default'], 10);
                    newFolder.version = parseInt(folder['version'], 10);
                    newFolder.name = String(folder['name']);
                    newFolder.folderID = new UUID(folderID);
                    newFolder.parentID = new UUID(folder['parent_id']);
                    this.folders.push(newFolder);
                    return newFolder;
                }
            }
        }
        throw new Error('Failed to create inventory folder');
    }

    async delete(saveCache: boolean = false): Promise<void>
    {
        const { caps } = this.agent.currentRegion;
        const invCap = await caps.getCapability('InventoryAPIv3');

        await this.agent.currentRegion.caps.requestDelete(`${invCap}/category/${this.folderID}`)
        const folders = this.getChildFoldersRecursive();

        for (const folder of folders)
        {
            delete this.inventoryBase.skeleton[folder.folderID.toString()]
        }
        if (saveCache)
        {
            for (const folder of folders)
            {
                const fileName = path.join(this.cacheDir + '/' + folder.folderID.toString());

                try
                {
                    const stat = await fs.stat(fileName);
                    if (stat.isFile())
                    {
                        await fs.unlink(fileName);
                    }
                }
                catch (error: unknown)
                {

                }
            }
        }
    }

    private async saveCache(): Promise<void>
    {
        const json = {
            version: this.version,
            items: this.items
        };
        const fileName = path.join(this.cacheDir + '/' + this.folderID.toString());
        await fs.writeFile(fileName, JSON.stringify(json));
    }

    private async loadCache(): Promise<void>
    {
        const fileName = path.join(this.cacheDir + '/' + this.folderID.toString());

        try
        {
            const data = await fs.readFile(fileName);

            const json: any = JSON.parse(data.toString('utf8'));
            if (json['version'] >= this.version)
            {
                this.items = [];
                for (const item of json['items'])
                {
                    item.created = new Date(item.created.mUUID);
                    item.assetID = new UUID(item.assetID.mUUID);
                    item.parentID = new UUID(item.parentID.mUUID);
                    item.itemID = new UUID(item.itemID.mUUID);
                    item.permissions.lastOwner = new UUID(item.permissions.lastOwner.mUUID);
                    item.permissions.owner = new UUID(item.permissions.owner.mUUID);
                    item.permissions.creator = new UUID(item.permissions.creator.mUUID);
                    item.permissions.group = new UUID(item.permissions.group.mUUID);
                    await this.addItem(item, false);
                }
            }
            else
            {
                throw new Error('Old version');
            }
        }
        catch (error: unknown)
        {
            throw new Error('Cache miss');
        }
    }

    async removeItem(itemID: UUID, save: boolean = false): Promise<void>
    {
        if (this.agent.inventory.itemsByID[itemID.toString()])
        {
            delete this.agent.inventory.itemsByID[itemID.toString()];
            this.items = this.items.filter((item) =>
            {
                return !item.itemID.equals(itemID);
            })
        }
        if (save)
        {
            return this.saveCache();
        }
    }

    async addItem(item: InventoryItem, save: boolean = false): Promise<void>
    {
        if (this.agent.inventory.itemsByID[item.itemID.toString()])
        {
            await this.removeItem(item.itemID, false);
        }
        this.items.push(item);
        this.agent.inventory.itemsByID[item.itemID.toString()] = item;
        if (save)
        {
            return this.saveCache();
        }
    }

    private populateInternal(): Promise<void>
    {
        return new Promise<void>((resolve) =>
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

            let cmd = 'FetchInventoryDescendents2';
            if (this.library === InventoryLibrary.Library)
            {
                cmd = 'FetchLibDescendents2';
            }

            this.agent.currentRegion.caps.capsPostXML(cmd, requestedFolders).then((folderContents: any) =>
            {
                for (const folder of folderContents['folders'][0]['categories'])
                {
                    let folderIDStr = folder['category_id'];
                    if (folderIDStr === undefined)
                    {
                        folderIDStr = folder['folder_id'];
                    }
                    const folderID = new UUID(folderIDStr);
                    let found = false;
                    for (const fld of this.folders)
                    {
                        if (fld.folderID.equals(folderID))
                        {
                            found = true;
                            break;
                        }
                    }
                    if (found)
                    {
                        continue;
                    }

                    const newFolder = new InventoryFolder(this.library, this.agent.inventory.main, this.agent);
                    newFolder.typeDefault = parseInt(folder['type_default'], 10);
                    newFolder.version = parseInt(folder['version'], 10);
                    newFolder.name = String(folder['name']);
                    newFolder.folderID = folderID;
                    newFolder.parentID = new UUID(folder['parent_id']);
                    this.folders.push(newFolder);
                }
                if (folderContents['folders'] && folderContents['folders'][0] && folderContents['folders'][0]['items'])
                {
                    this.version = folderContents['folders'][0]['version'];
                    this.items = [];
                    for (const item of folderContents['folders'][0]['items'])
                    {
                        const invItem = new InventoryItem(this, this.agent);
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
                        if (item['permissions']['last_owner_id'] === undefined)
                        {
                            // TODO: OpenSim Glitch;
                            item['permissions']['last_owner_id'] = item['permissions']['owner_id'];
                        }
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
                        this.addItem(invItem, false);
                    }
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
    }

    populate(useCached = true): Promise<void>
    {
        if (!useCached)
        {
            return this.populateInternal();
        }
        return new Promise<void>((resolve, reject) =>
        {
            this.loadCache().then(() =>
            {
                resolve();
            }).catch(() =>
            {
                this.populateInternal().then(() =>
                {
                  resolve();
                }).catch((erro: Error) =>
                {
                    reject(erro);
                });
            });
        });
    }

    private uploadInventoryAssetLegacy(assetType: AssetType, inventoryType: InventoryType, data: Buffer, name: string, description: string, flags: InventoryItemFlags): Promise<UUID>
    {
        return new Promise<UUID>(async (resolve, reject) =>
        {
            // Send an AssetUploadRequest and a CreateInventoryRequest simultaneously
            const msg = new AssetUploadRequestMessage();
            const transactionID = UUID.random();
            msg.AssetBlock = {
                StoreLocal: false,
                Type: assetType,
                Tempfile: false,
                TransactionID: transactionID,
                AssetData: Buffer.allocUnsafe(0)
            };

            const callbackID = ++this.callbackID;


            const createMsg = new CreateInventoryItemMessage();

            let wearableType = WearableType.Shape;
            if (inventoryType === InventoryType.Wearable)
            {
                const wearable = new LLWearable(data.toString('utf-8'));
                wearableType = wearable.type;
            }
            else
            {
                const wearableInFlags = flags & InventoryItemFlags.FlagsSubtypeMask;
                if (wearableInFlags > 0)
                {
                    wearableType = wearableInFlags;
                }
            }

            createMsg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.agent.currentRegion.circuit.sessionID
            };
            createMsg.InventoryBlock = {
                CallbackID: callbackID,
                FolderID: this.folderID,
                TransactionID: transactionID,
                NextOwnerMask: (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                Type: assetType,
                InvType: inventoryType,
                WearableType: wearableType,
                Name: Utils.StringToBuffer(name),
                Description: Utils.StringToBuffer(description)
            };

            this.agent.currentRegion.circuit.waitForMessage<UpdateCreateInventoryItemMessage>(Message.UpdateCreateInventoryItem, 10000, (message: UpdateCreateInventoryItemMessage) =>
            {
                if (message.InventoryData[0].CallbackID === callbackID)
                {
                    return FilterResponse.Finish;
                }
                else
                {
                    return FilterResponse.NoMatch;
                }
            }).then((result: UpdateCreateInventoryItemMessage) =>
            {
                if (!result.InventoryData || result.InventoryData.length < 1)
                {
                    reject('Failed to create inventory item for wearable');
                }
                resolve(result.InventoryData[0].ItemID);
            });


            if (data.length + 100 < 1200)
            {
                msg.AssetBlock.AssetData = data;
                this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
                this.agent.currentRegion.circuit.sendMessage(createMsg, PacketFlags.Reliable);
            }
            else
            {
                this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
                this.agent.currentRegion.circuit.sendMessage(createMsg, PacketFlags.Reliable);
                const result: RequestXferMessage = await this.agent.currentRegion.circuit.waitForMessage<RequestXferMessage>(Message.RequestXfer, 10000);
                await this.agent.currentRegion.circuit.XferFileUp(result.XferID.ID, data);
            }
        });
    }

    private uploadInventoryItem(assetType: AssetType, inventoryType: InventoryType, data: Buffer, name: string, description: string, flags: InventoryItemFlags): Promise<UUID>
    {
        return new Promise<UUID>((resolve, reject) =>
        {
            let wearableType = WearableType.Shape;
            const wearableInFlags = flags & InventoryItemFlags.FlagsSubtypeMask;
            if (wearableInFlags > 0)
            {
                wearableType = wearableInFlags;
            }

            const transactionID = UUID.zero();
            const callbackID = ++this.callbackID;
            const msg = new CreateInventoryItemMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.agent.currentRegion.circuit.sessionID
            };
            msg.InventoryBlock = {
                CallbackID: callbackID,
                FolderID: this.folderID,
                TransactionID: transactionID,
                NextOwnerMask: (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                Type: assetType,
                InvType: inventoryType,
                WearableType: wearableType,
                Name: Utils.StringToBuffer(name),
                Description: Utils.StringToBuffer(description)
            };
            this.agent.currentRegion.circuit.waitForMessage<UpdateCreateInventoryItemMessage>(Message.UpdateCreateInventoryItem, 10000, (message: UpdateCreateInventoryItemMessage) =>
            {
                if (message.InventoryData[0].CallbackID === callbackID)
                {
                    return FilterResponse.Finish;
                }
                else
                {
                    return FilterResponse.NoMatch;
                }
            }).then((createInventoryMsg: UpdateCreateInventoryItemMessage) =>
            {
                switch (inventoryType)
                {
                    case InventoryType.Notecard:
                    {
                        this.agent.currentRegion.caps.capsPostXML('UpdateNotecardAgentInventory', {
                            'item_id': new LLSD.UUID(createInventoryMsg.InventoryData[0].ItemID.toString()),
                        }).then((result: any) =>
                        {
                            if (result['uploader'])
                            {
                                const uploader = result['uploader'];
                                this.agent.currentRegion.caps.capsRequestUpload(uploader, data).then((uploadResult: any) =>
                                {
                                    if (uploadResult['state'] && uploadResult['state'] === 'complete')
                                    {
                                        const itemID: UUID = createInventoryMsg.InventoryData[0].ItemID;
                                        resolve(itemID);
                                    }
                                    else
                                    {
                                        reject(new Error('Asset upload failed'))
                                    }
                                }).catch((err) =>
                                {
                                    reject(err);
                                });
                            }
                            else
                            {
                                reject(new Error('Invalid response when attempting to request upload URL for notecard'));
                            }
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                        break;
                    }
                    case InventoryType.Settings:
                    {
                        this.agent.currentRegion.caps.capsPostXML('UpdateSettingsAgentInventory', {
                            'item_id': new LLSD.UUID(createInventoryMsg.InventoryData[0].ItemID.toString()),
                        }).then((result: any) =>
                        {
                            if (result['uploader'])
                            {
                                const uploader = result['uploader'];
                                this.agent.currentRegion.caps.capsRequestUpload(uploader, data).then((uploadResult: any) =>
                                {
                                    if (uploadResult['state'] && uploadResult['state'] === 'complete')
                                    {
                                        const itemID: UUID = createInventoryMsg.InventoryData[0].ItemID;
                                        resolve(itemID);
                                    }
                                    else
                                    {
                                        reject(new Error('Asset upload failed'))
                                    }
                                }).catch((err) =>
                                {
                                    reject(err);
                                });
                            }
                            else
                            {
                                reject(new Error('Invalid response when attempting to request upload URL for notecard'));
                            }
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                        break;
                    }
                    case InventoryType.Gesture:
                    {
                        this.agent.currentRegion.caps.isCapAvailable('UpdateGestureAgentInventory').then((available) =>
                        {
                           if (available)
                           {
                               this.agent.currentRegion.caps.capsPostXML('UpdateGestureAgentInventory', {
                                   'item_id': new LLSD.UUID(createInventoryMsg.InventoryData[0].ItemID.toString()),
                               }).then((result: any) =>
                               {
                                   if (result['uploader'])
                                   {
                                       const uploader = result['uploader'];
                                       this.agent.currentRegion.caps.capsRequestUpload(uploader, data).then((uploadResult: any) =>
                                       {
                                           if (uploadResult['state'] && uploadResult['state'] === 'complete')
                                           {
                                               const itemID: UUID = createInventoryMsg.InventoryData[0].ItemID;
                                               resolve(itemID);
                                           }
                                           else
                                           {
                                               reject(new Error('Asset upload failed'))
                                           }
                                       }).catch((err) =>
                                       {
                                           reject(err);
                                       });
                                   }
                                   else
                                   {
                                       reject(new Error('Invalid response when attempting to request upload URL for notecard'));
                                   }
                               }).catch((err) =>
                               {
                                   reject(err);
                               });
                           }
                           else
                           {
                               this.uploadInventoryAssetLegacy(assetType, inventoryType, data, name, description, flags).then((invItemID: UUID) =>
                               {
                                   resolve(invItemID);
                               }).catch((err: Error) =>
                               {
                                   reject(err);
                               });
                           }
                        });
                        break;
                    }
                    case InventoryType.Script:
                    case InventoryType.LSL:
                    {
                        this.agent.currentRegion.caps.capsPostXML('UpdateScriptAgent', {
                            'item_id': new LLSD.UUID(createInventoryMsg.InventoryData[0].ItemID.toString()),
                            'target': 'mono'
                        }).then((result: any) =>
                        {
                            if (result['uploader'])
                            {
                                const uploader = result['uploader'];
                                this.agent.currentRegion.caps.capsRequestUpload(uploader, data).then((uploadResult: any) =>
                                {
                                    if (uploadResult['state'] && uploadResult['state'] === 'complete')
                                    {
                                        const itemID: UUID = createInventoryMsg.InventoryData[0].ItemID;
                                        resolve(itemID);
                                    }
                                    else
                                    {
                                        reject(new Error('Asset upload failed'))
                                    }
                                }).catch((err) =>
                                {
                                    reject(err);
                                });
                            }
                            else
                            {
                                reject(new Error('Invalid response when attempting to request upload URL for notecard'));
                            }
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                        break;
                    }
                    default:
                    {
                        reject(new Error('Currently unsupported CreateInventoryType: '  + inventoryType));
                    }
                }
            }).catch(() =>
            {
                reject(new Error('Timed out waiting for UpdateCreateInventoryItem'));
            });
            this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        });
    }

    uploadAsset(type: AssetType, inventoryType: InventoryType, data: Buffer, name: string, description: string, flags: InventoryItemFlags = InventoryItemFlags.None): Promise<InventoryItem>
    {
        return new Promise<InventoryItem>((resolve, reject) =>
        {
            switch (inventoryType)
            {
                case InventoryType.Wearable:
                case InventoryType.Bodypart:
                    // Wearables have to be uploaded using the legacy method and then created
                    this.uploadInventoryAssetLegacy(type, inventoryType, data, name, description, flags).then((invItemID: UUID) =>
                    {
                        this.agent.inventory.fetchInventoryItem(invItemID).then((item: InventoryItem | null) =>
                        {
                            if (item === null)
                            {
                                reject(new Error('Unable to get inventory item'));
                            }
                            else
                            {
                                this.addItem(item, false).then(() =>
                                {
                                    resolve(item);
                                });
                            }
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                    }).catch((err) =>
                    {
                        reject(err);
                    });
                    return;
                case InventoryType.Landmark:
                case InventoryType.Notecard:
                case InventoryType.Gesture:
                case InventoryType.Script:
                case InventoryType.LSL:
                case InventoryType.Settings:
                    // These types must be created first and then modified
                    this.uploadInventoryItem(type, inventoryType, data, name, description, flags).then((invItemID: UUID) =>
                    {
                        this.agent.inventory.fetchInventoryItem(invItemID).then((item: InventoryItem | null) =>
                        {
                            if (item === null)
                            {
                                reject(new Error('Unable to get inventory item'));
                            }
                            else
                            {
                                this.addItem(item, false).then(() =>
                                {
                                    resolve(item);
                                });
                            }
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                    }).catch((err) =>
                    {
                        reject(err);
                    });
                    return;
            }
            Logger.Info('[' + name + ']');
            const httpType = Utils.AssetTypeToHTTPAssetType(type);
            this.agent.currentRegion.caps.capsPostXML('NewFileAgentInventory', {
                'folder_id': new LLSD.UUID(this.folderID.toString()),
                'asset_type': httpType,
                'inventory_type': Utils.HTTPAssetTypeToCapInventoryType(httpType),
                'name': name,
                'description': description,
                'everyone_mask': PermissionMask.All,
                'group_mask': PermissionMask.All,
                'next_owner_mask': PermissionMask.All,
                'expected_upload_cost': 0
            }).then((response: any) =>
            {
                if (response['state'] === 'upload')
                {
                    const uploadURL = response['uploader'];
                    this.agent.currentRegion.caps.capsRequestUpload(uploadURL, data).then((responseUpload: any) =>
                    {
                        if (responseUpload['new_inventory_item'] !== undefined)
                        {
                            const invItemID = new UUID(responseUpload['new_inventory_item'].toString());
                            this.agent.inventory.fetchInventoryItem(invItemID).then((item: InventoryItem | null) =>
                            {
                                if (item === null)
                                {
                                    reject(new Error('Unable to get inventory item'));
                                }
                                else
                                {
                                    this.addItem(item, false).then(() =>
                                    {
                                        resolve(item);
                                    });
                                }
                            }).catch((err) =>
                            {
                                reject(err);
                            });
                        }
                    }).catch((err) =>
                    {
                        reject(err);
                    });
                }
                else if (response['error'])
                {
                    reject(response['error']['message']);
                }
                else
                {
                    reject('Unable to upload asset');
                }
            }).catch((err) =>
            {
                console.log('Got err');
                console.log(err);
                reject(err);
            })
        });
    }

    checkCopyright(creatorID: UUID): void
    {
        if (!creatorID.equals(this.agent.agentID) && !creatorID.isZero())
        {
            throw new Error('Unable to upload - copyright violation');
        }
    }

    findFolder(id: UUID): InventoryFolder | null
    {
        for (const folder of this.folders)
        {
            if (folder.folderID.equals(id))
            {
                return folder;
            }
            const result = folder.findFolder(id);
            if (result !== null)
            {
                return result;
            }
        }
        return null;
    }

    async uploadMesh(name: string, description: string, mesh: Buffer, confirmCostCallback: (cost: number) => Promise<boolean>): Promise<InventoryItem>
    {
        const decodedMesh = await LLMesh.from(mesh);

        this.checkCopyright(decodedMesh.creatorID);

        const faces = [];
        const faceCount = decodedMesh.lodLevels['high_lod'].length;
        for (let x = 0; x < faceCount; x++)
        {
            faces.push({
                'diffuse_color': [1.000000000000001, 1.000000000000001, 1.000000000000001, 1.000000000000001],
                'fullbright': false
            });
        }
        const prim = {
            'face_list': faces,
            'position': [0.000000000000001, 0.000000000000001, 0.000000000000001],
            'rotation': [0.000000000000001, 0.000000000000001, 0.000000000000001, 1.000000000000001],
            'scale': [2.000000000000001, 2.000000000000001, 2.000000000000001],
            'material': 3,
            'physics_shape_type': 2,
            'mesh': 0
        };
        const assetResources = {
            'instance_list': [prim],
            'mesh_list': [new LLSD.Binary(Array.from(mesh))],
            'texture_list': [],
            'metric': 'MUT_Unspecified'
        };
        const uploadMap = {
            'name': String(name),
            'description': String(description),
            'asset_resources': assetResources,
            'asset_type': 'mesh',
            'inventory_type': 'object',
            'folder_id': new LLSD.UUID(this.folderID.toString()),
            'texture_folder_id': new LLSD.UUID(await this.agent.inventory.findFolderForType(FolderType.Texture)),
            'everyone_mask': PermissionMask.All,
            'group_mask': PermissionMask.All,
            'next_owner_mask': PermissionMask.All
        };
        let result;
        try
        {
            result = await this.agent.currentRegion.caps.capsPostXML('NewFileAgentInventory', uploadMap);
        }
        catch (error)
        {
            console.error(error);
        }
        if (result['state'] === 'upload' && result['upload_price'] !== undefined)
        {
            const cost = result['upload_price'];
            if (await confirmCostCallback(cost))
            {
                const uploader = result['uploader'];
                const uploadResult = await this.agent.currentRegion.caps.capsPerformXMLPost(uploader, assetResources);
                if (uploadResult['new_inventory_item'] && uploadResult['new_asset'])
                {
                    const inventoryItem = new UUID(uploadResult['new_inventory_item'].toString());
                    const item = await this.agent.inventory.fetchInventoryItem(inventoryItem);
                    if (item !== null)
                    {
                        item.assetID = new UUID(uploadResult['new_asset'].toString());
                        await this.addItem(item, false);
                        return item;
                    }
                    else
                    {
                        throw new Error('Unable to locate inventory item following mesh upload');
                    }
                }
                else
                {

                    throw new Error('Upload failed - no new inventory item returned');
                }
            }
            throw new Error('Upload cost declined')
        }
        else
        {
            console.log(result);
            console.log(JSON.stringify(result.error));
            throw new Error('Upload failed');
        }
    }
}
