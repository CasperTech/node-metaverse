import type { InventoryFolder } from '../classes/InventoryFolder';
import type { InventoryItem } from '../classes/InventoryItem';

export class BulkUpdateInventoryEvent
{
    public folderData: InventoryFolder[] = [];
    public itemData: InventoryItem[] = [];
}
