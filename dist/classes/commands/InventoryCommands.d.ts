import { CommandsBase } from './CommandsBase';
import { InventoryFolder } from '../InventoryFolder';
export declare class InventoryCommands extends CommandsBase {
    getInventoryRoot(): InventoryFolder;
    getLibraryRoot(): InventoryFolder;
}
