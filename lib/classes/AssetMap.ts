import { InventoryItem } from './InventoryItem';
import { Material } from './public/Material';

export class AssetMap
{
    mesh: {
        [key: string]: {
            name: string,
            description: string,
            item: InventoryItem | null
        }
    } = {};
    textures: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    materials: {
        [key: string]: Material | null
    } = {};
    animations: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    sounds: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    gestures: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    callingcards: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    scripts: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    clothing: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    notecards: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    bodyparts: {
        [key: string]: {
            name?: string,
            description?: string,
            item: InventoryItem | null
        }
    } = {};
    objects: {
        [key: string]: InventoryItem | null
    } = {};
    temporaryInventory: {
        [key: string]: InventoryItem
    } = {};
    byUUID: {
        [key: string]: InventoryItem
    } = {};
    pending: {[key: string]: boolean} = {};
}
