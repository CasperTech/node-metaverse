import * as LLSD from '@caspertech/llsd';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { AssetType } from '../enums/AssetType';
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
import type { Agent } from './Agent';
import { InventoryItem } from './InventoryItem';
import { LLWearable } from './LLWearable';
import { Logger } from './Logger';
import { AssetUploadRequestMessage } from './messages/AssetUploadRequest';
import { CreateInventoryFolderMessage } from './messages/CreateInventoryFolder';
import { CreateInventoryItemMessage } from './messages/CreateInventoryItem';
import type { RequestXferMessage } from './messages/RequestXfer';
import type { UpdateCreateInventoryItemMessage } from './messages/UpdateCreateInventoryItem';
import { LLMesh } from './public/LLMesh';
import { Utils } from './Utils';
import { UUID } from './UUID';
import { AssetTypeRegistry } from './AssetTypeRegistry';
import { InventoryTypeRegistry } from './InventoryTypeRegistry';

export class InventoryFolder
{
    public typeDefault: FolderType;
    public version: number;
    public name: string;
    public folderID: UUID;
    public parentID: UUID;
    public items: InventoryItem[] = [];
    public folders: InventoryFolder[] = [];
    public cacheDir: string;
    public agent: Agent;
    public library: InventoryLibrary;

    private callbackID = 1;

    private readonly inventoryBase: {
        owner?: UUID,
        skeleton: Map<string, InventoryFolder>,
        root?: UUID
    };

    public constructor(lib: InventoryLibrary,
                       invBase: {
                           owner?: UUID,
                           skeleton: Map<string, InventoryFolder>,
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

    public getChildFolders(): InventoryFolder[]
    {
        const children: InventoryFolder[] = [];
        const ofi = this.folderID.toString();
        for (const folder of this.inventoryBase.skeleton.values())
        {
            if (folder !== undefined && folder.parentID.toString() === ofi)
            {
                children.push(folder);
            }
        }
        return children;
    }

    public getChildFoldersRecursive(): InventoryFolder[]
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
            const folder = this.inventoryBase.skeleton.get(uuid.toString());
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

    public async createFolder(name: string, type: FolderType): Promise<InventoryFolder>
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
        if (folderContents.folders?.[0]?.categories && folderContents.folders[0].categories.length > 0)
        {
            for (const folder of folderContents.folders[0].categories)
            {
                let folderID = folder.category_id;
                if (folderID === undefined)
                {
                    folderID = folder.folder_id;
                }
                if (folderID === undefined)
                {
                    continue;
                }
                const foundFolderID = new UUID(folderID.toString());
                if (foundFolderID.equals(msg.FolderData.FolderID))
                {
                    const newFolder = new InventoryFolder(this.library, this.agent.inventory.main, this.agent);
                    newFolder.typeDefault = parseInt(folder.type_default, 10);
                    newFolder.version = parseInt(folder.version, 10);
                    newFolder.name = String(folder.name);
                    newFolder.folderID = new UUID(folderID);
                    newFolder.parentID = new UUID(folder.parent_id);
                    this.folders.push(newFolder);
                    return newFolder;
                }
            }
        }
        throw new Error('Failed to create inventory folder');
    }

    public async delete(saveCache = false): Promise<void>
    {
        const { caps } = this.agent.currentRegion;
        const invCap = await caps.getCapability('InventoryAPIv3');

        await this.agent.currentRegion.caps.requestDelete(`${invCap}/category/${this.folderID.toString()}`)
        const folders = this.getChildFoldersRecursive();

        for (const folder of folders)
        {
            this.inventoryBase.skeleton.delete(folder.folderID.toString());
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
                catch (_error: unknown)
                {
                    // ignore
                }
            }
        }
    }

    public async removeItem(itemID: UUID, save = false): Promise<void>
    {
        const item = this.agent.inventory.itemsByID.get(itemID.toString());
        if (item)
        {
            this.agent.inventory.itemsByID.delete(itemID.toString());
            this.items = this.items.filter((filterItem) =>
            {
                return !filterItem.itemID.equals(itemID);
            })
        }
        if (save)
        {
            await this.saveCache();
        }
    }

    public async addItem(item: InventoryItem, save = false): Promise<void>
    {
        if (this.agent.inventory.itemsByID.has(item.itemID.toString()))
        {
            await this.removeItem(item.itemID, false);
        }
        this.items.push(item);
        this.agent.inventory.itemsByID.set(item.itemID.toString(), item);
        if (save)
        {
            await this.saveCache();
        }
    }

    public async populate(useCached = true): Promise<void>
    {
        if (!useCached)
        {
            await this.populateInternal();
            return;
        }
        try
        {
            await this.loadCache();
        }
        catch(_e: unknown)
        {
            await this.populateInternal();
        }
    }

    public async uploadAsset(type: AssetType, inventoryType: InventoryType, data: Buffer, name: string, description: string, flags: InventoryItemFlags = InventoryItemFlags.None): Promise<InventoryItem>
    {
        switch (inventoryType)
        {
            case InventoryType.Wearable:
            {
                // Wearables have to be uploaded using the legacy method and then created
                const invItemID = await this.uploadInventoryAssetLegacy(type, inventoryType, data, name, description, flags);
                const uploadedItem: InventoryItem | null = await this.agent.inventory.fetchInventoryItem(invItemID)
                if (uploadedItem === null)
                {
                    throw new Error('Unable to get inventory item');
                }
                else
                {
                    await this.addItem(uploadedItem, false);
                }
                return uploadedItem;
            }
            case InventoryType.Landmark:
            case InventoryType.Notecard:
            case InventoryType.Gesture:
            case InventoryType.LSL:
            case InventoryType.Settings:
            case InventoryType.Material:
            {
                // These types must be created first and then modified
                const invItemID: UUID = await this.uploadInventoryItem(type, inventoryType, data, name, description, flags);
                const item: InventoryItem | null = await this.agent.inventory.fetchInventoryItem(invItemID)
                if (item === null)
                {
                    throw new Error('Unable to get inventory item');
                }
                else
                {
                    await this.addItem(item, false);
                }
                return item;
            }
            default:
                break;
        }

        const uploadCost = await this.agent.currentRegion.getUploadCost();

        Logger.Info('[' + name + ']');
        const response = await this.agent.currentRegion.caps.capsPostXML('NewFileAgentInventory', {
            'folder_id': new LLSD.UUID(this.folderID.toString()),
            'asset_type': AssetTypeRegistry.getTypeName(type),
            'inventory_type': InventoryTypeRegistry.getTypeName(inventoryType),
            'name': name,
            'description': description,
            'everyone_mask': PermissionMask.All,
            'group_mask': PermissionMask.All,
            'next_owner_mask': PermissionMask.All,
            'expected_upload_cost': uploadCost
        });

        if (response.state === 'upload')
        {
            const uploadURL = response.uploader;
            const responseUpload = await this.agent.currentRegion.caps.capsRequestUpload(uploadURL, data);
            if (responseUpload.new_inventory_item !== undefined)
            {
                const invItemID = new UUID(responseUpload.new_inventory_item.toString());
                const item: InventoryItem | null = await this.agent.inventory.fetchInventoryItem(invItemID);
                if (item === null)
                {
                    throw new Error('Unable to get inventory item');
                }
                else
                {
                    await this.addItem(item, false);
                }
                return item;
            }
            else
            {
                throw new Error('Unable to upload asset');
            }
        }
        else if (response.error)
        {
            throw new Error(response.error.message);
        }
        else
        {
            throw new Error('Unable to upload asset');
        }
    }

    public checkCopyright(creatorID: UUID): void
    {
        if (!creatorID.equals(this.agent.agentID) && !creatorID.isZero())
        {
            throw new Error('Unable to upload - copyright violation');
        }
    }

    public findFolder(id: UUID): InventoryFolder | null
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

    public async uploadMesh(name: string, description: string, mesh: Buffer, confirmCostCallback: (cost: number) => Promise<boolean>): Promise<InventoryItem>
    {
        const decodedMesh = await LLMesh.from(mesh);

        if (decodedMesh.creatorID !== undefined)
        {
            this.checkCopyright(decodedMesh.creatorID);
        }

        const faces = [];
        const faceCount = decodedMesh.lodLevels.high_lod.length;
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
            'texture_folder_id': new LLSD.UUID(this.agent.inventory.findFolderForType(FolderType.Texture)),
            'everyone_mask': PermissionMask.All,
            'group_mask': PermissionMask.All,
            'next_owner_mask': PermissionMask.All
        };
        let result: any = null;
        try
        {
            result = await this.agent.currentRegion.caps.capsPostXML('NewFileAgentInventory', uploadMap);
        }
        catch (error)
        {
            console.error(error);
        }
        if (result.state === 'upload' && result.upload_price !== undefined)
        {
            const cost = result.upload_price;
            if (await confirmCostCallback(cost))
            {
                const uploader = result.uploader;
                const uploadResult = await this.agent.currentRegion.caps.capsPerformXMLPost(uploader, assetResources);
                if (uploadResult.new_inventory_item && uploadResult.new_asset)
                {
                    const inventoryItem = new UUID(uploadResult.new_inventory_item.toString());
                    const item = await this.agent.inventory.fetchInventoryItem(inventoryItem);
                    if (item !== null)
                    {
                        item.assetID = new UUID(uploadResult.new_asset.toString());
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

    private async saveCache(): Promise<void>
    {
        const json = {
            version: this.version,
            childItems: this.items,
            childFolders: this.folders
        };

        const fileName = path.join(this.cacheDir + '/' + this.folderID.toString() + '.json');

        const replacer = (key: string, value: unknown): unknown =>
        {
            if (key === 'container' || key === 'agent' || key === 'folders' || key === 'items' || key === 'cacheDir' || key === 'inventoryBase')
            {
                return undefined;
            }
            return value;
        };

        await fs.writeFile(fileName, JSON.stringify(json, replacer));
    }

    private async loadCache(): Promise<void>
    {
        const fileName = path.join(this.cacheDir + '/' + this.folderID.toString() + ".json");

        try
        {
            const data = await fs.readFile(fileName);

            const json = JSON.parse(data.toString('utf8')) as {
                version: number,
                childFolders: {
                    typeDefault: FolderType;
                    version: number;
                    name: string;
                    folderID: {
                        mUUID: string
                    };
                    parentID: {
                        mUUID: string
                    };
                }[],
                childItems: {
                    assetID: {
                        mUUID: string
                    },
                    inventoryType: InventoryType;
                    name: string;
                    metadata: string;
                    salePrice: number;
                    saleType: number;
                    created: Date;
                    parentID: {
                        mUUID: string
                    };
                    flags: InventoryItemFlags;
                    itemID: {
                        mUUID: string
                    };
                    oldItemID?: {
                        mUUID: string
                    };
                    parentPartID?: {
                        mUUID: string
                    };
                    permsGranter?: string;
                    description: string;
                    type: AssetType;
                    callbackID: number;
                    permissions: {
                        baseMask: PermissionMask;
                        groupMask: PermissionMask;
                        nextOwnerMask: PermissionMask;
                        ownerMask: PermissionMask;
                        everyoneMask: PermissionMask;
                        lastOwner: {
                            mUUID: string
                        };
                        owner: {
                            mUUID: string
                        };
                        creator: {
                            mUUID: string
                        };
                        group: {
                            mUUID: string
                        };
                        groupOwned?: boolean
                    }
                }[]
            };
            if (json.version >= this.version)
            {
                this.items = [];
                for (const folder of json.childFolders)
                {
                    let f = this.findFolder(new UUID(folder.folderID.mUUID));
                    if (f !== null)
                    {
                        continue;
                    }
                    f = new InventoryFolder(this.library, this.inventoryBase, this.agent);
                    f.parentID = this.folderID;
                    f.typeDefault = folder.typeDefault;
                    f.version = folder.version;
                    f.name = folder.name;
                    f.folderID = new UUID(folder.folderID.mUUID);
                    this.folders.push(f);
                }
                for (const item of json.childItems)
                {
                    const i = new InventoryItem(this, this.agent);
                    i.created = new Date(item.created);
                    i.assetID = new UUID(item.assetID.mUUID);
                    i.parentID = this.folderID;
                    i.itemID = new UUID(item.itemID.mUUID);
                    i.permissions = {
                        lastOwner: new UUID(item.permissions.lastOwner.mUUID),
                        owner: new UUID(item.permissions.owner.mUUID),
                        creator: new UUID(item.permissions.creator.mUUID),
                        group: new UUID(item.permissions.group.mUUID),
                        baseMask: item.permissions.baseMask,
                        groupMask: item.permissions.groupMask,
                        nextOwnerMask: item.permissions.nextOwnerMask,
                        ownerMask: item.permissions.ownerMask,
                        everyoneMask: item.permissions.everyoneMask
                    };
                    i.inventoryType = item.inventoryType;
                    i.name = item.name;
                    i.metadata = item.metadata;
                    i.salePrice = item.salePrice;
                    i.saleType = item.saleType;
                    i.flags = item.flags;
                    i.description= item.description;
                    i.type = item.type;
                    await this.addItem(i, false);
                }
            }
            else
            {
                throw new Error('Old version');
            }
        }
        catch (_error: unknown)
        {
            throw new Error('Cache miss');
        }
    }

    private async populateInternal(): Promise<void>
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

        const folderContents = await this.agent.currentRegion.caps.capsPostXML(cmd, requestedFolders) as unknown as {
            folders: {
                categories: {
                    category_id: string,
                    folder_id: string,
                    type_default: string,
                    version: string,
                    name: string,
                    parent_id: string
                }[]
                items: {
                    asset_id: string,
                    inv_type: InventoryType,
                    name: string,
                    sale_info: {
                        sale_price: number,
                        sale_type: number
                    },
                    created_at: number,
                    parent_id: string,
                    flags: number,
                    item_id: string,
                    desc: string,
                    type: number,
                    permissions: {
                        last_owner_id: string,
                        owner_id: string,
                        base_mask: number,
                        group_mask: number,
                        next_owner_mask: number,
                        owner_mask: number,
                        everyone_mask: number,
                        creator_id: string,
                        group_id: string
                    }
                }[],
                version: number
            }[]
        };
        for (const folder of folderContents.folders[0].categories)
        {
            let folderIDStr = folder.category_id;
            if (folderIDStr === undefined)
            {
                folderIDStr = folder.folder_id;
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
            newFolder.typeDefault = parseInt(folder.type_default, 10);
            newFolder.version = parseInt(folder.version, 10);
            newFolder.name = String(folder.name);
            newFolder.folderID = folderID;
            newFolder.parentID = new UUID(folder.parent_id);
            this.folders.push(newFolder);
        }
        if (folderContents.folders?.[0]?.items)
        {
            this.version = folderContents.folders[0].version;
            this.items = [];
            for (const item of folderContents.folders[0].items)
            {
                const invItem = new InventoryItem(this, this.agent);
                invItem.assetID = new UUID(item.asset_id.toString());
                invItem.inventoryType = item.inv_type;
                invItem.name = item.name;
                invItem.salePrice = item.sale_info.sale_price;
                invItem.saleType = item.sale_info.sale_type;
                invItem.created = new Date(item.created_at * 1000);
                invItem.parentID = new UUID(item.parent_id.toString());
                invItem.flags = item.flags;
                invItem.itemID = new UUID(item.item_id.toString());
                invItem.description = item.desc;
                invItem.type = item.type;
                if (item.permissions.last_owner_id === undefined)
                {
                    // TODO: OpenSim Glitch;
                    item.permissions.last_owner_id = item.permissions.owner_id;
                }
                invItem.permissions = {
                    baseMask: item.permissions.base_mask,
                    groupMask: item.permissions.group_mask,
                    nextOwnerMask: item.permissions.next_owner_mask,
                    ownerMask: item.permissions.owner_mask,
                    everyoneMask: item.permissions.everyone_mask,
                    lastOwner: new UUID(item.permissions.last_owner_id.toString()),
                    owner: new UUID(item.permissions.owner_id.toString()),
                    creator: new UUID(item.permissions.creator_id.toString()),
                    group: new UUID(item.permissions.group_id.toString())
                };
                await this.addItem(invItem, false);
            }
            await this.saveCache();
        }
    }

    private async uploadInventoryAssetLegacy(
        assetType: AssetType,
        inventoryType: InventoryType,
        data: Buffer,
        name: string,
        description: string,
        flags: InventoryItemFlags
    ): Promise<UUID>
    {
        const transactionID = UUID.random();
        const assetUploadMsg = new AssetUploadRequestMessage();
        assetUploadMsg.AssetBlock = {
            StoreLocal: false,
            Type: assetType,
            Tempfile: false,
            TransactionID: transactionID,
            AssetData: Buffer.allocUnsafe(0) // Initially empty; will be set later if data is small
        };

        const callbackID = ++this.callbackID;
        const createInventoryMsg = new CreateInventoryItemMessage();
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

        createInventoryMsg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.agent.currentRegion.circuit.sessionID
        };

        createInventoryMsg.InventoryBlock = {
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

        try
        {
            const waitForResponse = this.agent.currentRegion.circuit.waitForMessage<UpdateCreateInventoryItemMessage>(
                Message.UpdateCreateInventoryItem,
                10000,
                (message: UpdateCreateInventoryItemMessage) =>
                {
                    return message.InventoryData[0].CallbackID === callbackID
                        ? FilterResponse.Finish
                        : FilterResponse.NoMatch;
                }
            );

            if (data.length + 100 < 1200)
            {
                assetUploadMsg.AssetBlock.AssetData = data;
                this.agent.currentRegion.circuit.sendMessage(assetUploadMsg, PacketFlags.Reliable);
                this.agent.currentRegion.circuit.sendMessage(createInventoryMsg, PacketFlags.Reliable);
            }
            else
            {
                this.agent.currentRegion.circuit.sendMessage(assetUploadMsg, PacketFlags.Reliable);
                this.agent.currentRegion.circuit.sendMessage(createInventoryMsg, PacketFlags.Reliable);

                const xferRequest = await this.agent.currentRegion.circuit.waitForMessage<RequestXferMessage>(
                    Message.RequestXfer,
                    10000
                );

                await this.agent.currentRegion.circuit.XferFileUp(xferRequest.XferID.ID, data);
            }

            const response = await waitForResponse;
            if (!response.InventoryData || response.InventoryData.length < 1)
            {
                throw new Error('Failed to create inventory item for wearable');
            }

            return response.InventoryData[0].ItemID;
        }
        catch (error)
        {
            throw new Error(`uploadInventoryAssetLegacy failed: ${String(error instanceof Error ? error.message : error)}`);
        }
    }

    private async uploadInventoryItem(
        assetType: AssetType,
        inventoryType: InventoryType,
        data: Buffer,
        name: string,
        description: string,
        flags: InventoryItemFlags
    ): Promise<UUID>
    {
        // Determine the wearable type based on flags
        let wearableType = WearableType.Shape;
        const wearableInFlags = flags & InventoryItemFlags.FlagsSubtypeMask;
        if (wearableInFlags > 0)
        {
            wearableType = wearableInFlags;
        }

        // Generate transaction ID and callback ID
        const transactionID = UUID.zero();
        const callbackID = ++this.callbackID;

        // Create the CreateInventoryItemMessage
        const createInventoryMsg = new CreateInventoryItemMessage();
        createInventoryMsg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.agent.currentRegion.circuit.sessionID
        };
        createInventoryMsg.InventoryBlock = {
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

        try
        {
            const createInventoryResponse = await this.agent.currentRegion.circuit.sendAndWaitForMessage<UpdateCreateInventoryItemMessage>(
                createInventoryMsg,
                PacketFlags.Reliable,
                Message.UpdateCreateInventoryItem,
                10000,
                (message: UpdateCreateInventoryItemMessage) =>
                {
                    return message.InventoryData[0].CallbackID === callbackID
                        ? FilterResponse.Finish
                        : FilterResponse.NoMatch;
                }
            );

            if (!createInventoryResponse.InventoryData || createInventoryResponse.InventoryData.length < 1)
            {
                throw new Error('Failed to create inventory item');
            }

            const itemID: UUID = createInventoryResponse.InventoryData[0].ItemID;
            if (inventoryType === InventoryType.Notecard && data.length === 0)
            {
                // Empty notecard we can just leave as-is
                return itemID;
            }
            switch (inventoryType)
            {
                case InventoryType.Material:
                case InventoryType.Notecard:
                case InventoryType.Settings:
                case InventoryType.LSL:
                {
                    await this.handleStandardInventoryUpload(inventoryType, itemID, data);
                    return itemID;
                }
                case InventoryType.Gesture:
                {
                    const isGestureCapAvailable = await this.agent.currentRegion.caps.isCapAvailable('UpdateGestureAgentInventory');
                    if (isGestureCapAvailable)
                    {
                        await this.handleStandardInventoryUpload(inventoryType, itemID, data);
                        return itemID;
                    }
                    else
                    {
                        // Fallback to legacy upload method if Gesture caps are not available
                        const invItemID = await this.uploadInventoryAssetLegacy(assetType, inventoryType, data, name, description, flags);
                        return invItemID;
                    }
                }
                default:
                    throw new Error(`Currently unsupported CreateInventoryType: ${inventoryType}`);
            }
        }
        catch (error)
        {
            throw new Error(`uploadInventoryItem failed: ${String(error instanceof Error ? error.message : error)}`);
        }
    }

    /**
     * Handles the upload process for standard inventory types such as Notecard, Settings, Script, and LSL.
     * @param inventoryType The type of inventory item.
     * @param itemID The UUID of the created inventory item.
     * @param data The data buffer to upload.
     */
    private async handleStandardInventoryUpload(
        inventoryType: InventoryType,
        itemID: UUID,
        data: Buffer
    ): Promise<void>
    {
        let xmlEndpoint = '';
        switch (inventoryType)
        {
            case InventoryType.Notecard:
                xmlEndpoint = 'UpdateNotecardAgentInventory';
                break;
            case InventoryType.Material:
                xmlEndpoint = 'UpdateMaterialAgentInventory';
                break;
            case InventoryType.Settings:
                xmlEndpoint = 'UpdateSettingsAgentInventory';
                break;
            case InventoryType.LSL:
                xmlEndpoint = 'UpdateScriptAgent';
                break;
            default:
                throw new Error(`Unsupported inventory type for standard upload: ${inventoryType}`);
        }

        try
        {
            const xmlPayload: Record<string, any> = {
                'item_id': new LLSD.UUID(itemID.toString()),
            };

            if (inventoryType === InventoryType.LSL)
            {
                xmlPayload.target = 'mono';
            }

            const result: any = await this.agent.currentRegion.caps.capsPostXML(xmlEndpoint, xmlPayload);

            if (!result.uploader)
            {
                throw new Error(`Invalid response when attempting to request upload URL for ${inventoryType}`);
            }

            const uploader = result.uploader;
            const uploadResult: any = await this.agent.currentRegion.caps.capsRequestUpload(uploader, data);

            if (uploadResult.state !== 'complete')
            {
                throw new Error('Asset upload failed');
            }
        }
        catch (error)
        {
            throw new Error(`Failed to upload inventory item (${inventoryType}): ${String(error instanceof Error ? error.message : error)}`);
        }
    }
}
