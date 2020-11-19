import { InventoryFolder } from '../classes/InventoryFolder';
import { InventoryItem } from '../classes/InventoryItem';

export class BulkUpdateInventoryEvent
{
    folderData: InventoryFolder[] = [];
    itemData: InventoryItem[] = [];
}
