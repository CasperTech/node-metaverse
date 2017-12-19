import {CommandsBase} from './CommandsBase';
import {InventoryFolder} from '../InventoryFolder';

export class InventoryCommands extends CommandsBase
{
    getInventoryRoot(): InventoryFolder
    {
        return this.agent.inventory.getRootFolderMain();
    }
    getLibraryRoot(): InventoryFolder
    {
        return this.agent.inventory.getRootFolderLibrary();
    }
}