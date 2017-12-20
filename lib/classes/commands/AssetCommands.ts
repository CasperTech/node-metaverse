import {CommandsBase} from './CommandsBase';
import {HTTPAssets} from '../../enums/HTTPAssets';
import {UUID} from '../UUID';
import * as LLSD from '@caspertech/llsd';
import {Utils} from '../Utils';

export class AssetCommands extends CommandsBase
{
    downloadAsset(type: HTTPAssets, uuid: UUID)
    {
        return this.currentRegion.caps.downloadAsset(uuid, type);
    }

    uploadAsset(type: HTTPAssets, data: Buffer, name: string, description: string): Promise<UUID>
    {
        return new Promise<UUID>((resolve, reject) =>
        {
            if (this.agent && this.agent.inventory && this.agent.inventory.main && this.agent.inventory.main.root)
            {
                this.currentRegion.caps.capsRequestXML('NewFileAgentInventory', {
                    'folder_id': new LLSD.UUID(this.agent.inventory.main.root.toString()),
                    'asset_type': type,
                    'inventory_type': Utils.HTTPAssetTypeToInventoryType(type),
                    'name': name,
                    'description': description,
                    'everyone_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'group_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'next_owner_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'expected_upload_cost': 0
                }).then((response: any) =>
                {
                    if (response['state'] === 'upload')
                    {
                        const uploadURL = response['uploader'];
                        this.currentRegion.caps.capsRequestUpload(uploadURL, data).then((responseUpload: any) =>
                        {
                            resolve(new UUID(responseUpload['new_asset'].toString()));
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                    }
                }).catch((err) =>
                {
                    console.log(err);
                })
            }
        });
    }
}
