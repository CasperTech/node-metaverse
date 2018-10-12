import { CommandsBase } from './CommandsBase';
import { InventoryFolder } from '../InventoryFolder';
import { InventoryOfferedEvent } from '../..';
export declare class InventoryCommands extends CommandsBase {
    getInventoryRoot(): InventoryFolder;
    getLibraryRoot(): InventoryFolder;
    private respondToInventoryOffer;
    acceptInventoryOffer(event: InventoryOfferedEvent): Promise<void>;
    rejectInventoryOffer(event: InventoryOfferedEvent): Promise<void>;
}
