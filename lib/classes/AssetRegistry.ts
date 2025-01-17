import type { InventoryItem } from './InventoryItem';
import type { Material } from './public/Material';
import type { GameObject } from './public/GameObject';
import type { UUID } from './UUID';
import { AssetMap } from './AssetMap';

export class AssetRegistry
{
    public readonly mesh = new AssetMap();
    public readonly textures = new AssetMap();
    public readonly materials = new AssetMap<Material>();
    public readonly gltfMaterials = new AssetMap();
    public readonly animations = new AssetMap();
    public readonly sounds = new AssetMap();
    public readonly gestures = new AssetMap();
    public readonly callingcards = new AssetMap();
    public readonly scripts = new AssetMap();
    public readonly settings = new AssetMap();
    public readonly notecards = new AssetMap();
    public readonly wearables = new AssetMap();
    public readonly objects = new AssetMap();

    public scriptsToCompile = new Map<string, {
        gameObject: GameObject,
        scripts: {
            item: InventoryItem,
            oldAssetID: UUID,
            mono: boolean,
            shouldStart: boolean
        }[]
    }>;
    public temporaryInventory = new Map<string, InventoryItem>();
    public byUUID = new Map<string, InventoryItem>();
}
