import { ExampleBot } from '../ExampleBot';
import { InventoryFolder } from '../../lib/classes/InventoryFolder';
import { FolderType } from '../../lib/enums/FolderType';
import { InventoryItem } from '../../lib/classes/InventoryItem';
import { LLLindenText } from '../../lib/classes/LLLindenText';
import { AssetType } from '../../lib/enums/AssetType';
import { InventoryType } from '../../lib/enums/InventoryType';
import { PermissionMask } from '../../lib/enums/PermissionMask';
import { InventoryResponseEvent } from '../../lib/events/InventoryResponseEvent';
import { InventoryOfferedEvent } from '../../lib/events/InventoryOfferedEvent';

class Inventory extends ExampleBot
{
    async onConnected(): Promise<void>
    {
        this.bot.clientEvents.onInventoryOffered.subscribe(this.onInventoryOffered.bind(this));
        this.bot.clientEvents.onInventoryResponse.subscribe(this.onInventoryResponse.bind(this));

        // Get the root inventory folder
        const rootFolder = this.bot.clientCommands.inventory.getInventoryRoot();

        // Populate the root folder
        await rootFolder.populate(false);

        const exampleFolderName = 'node-metaverse example';
        const exampleNotecardName = 'Example Notecard';
        const exampleScriptName = 'Example script';

        let exampleFolder: InventoryFolder | undefined = undefined;
        for (const childFolder of rootFolder.folders)
        {
            if (childFolder.name === exampleFolderName)
            {
                exampleFolder = childFolder;
                await exampleFolder.populate(false);
                break;
            }
        }

        // Our folder doesnt' seem to exist, so create it
        if (exampleFolder === undefined)
        {
            exampleFolder = await rootFolder.createFolder(exampleFolderName, FolderType.None);
        }

        // See if we've already made our test notecard to avoid clutter..
        let exampleNotecard: InventoryItem | undefined = undefined;
        for (const childItem of exampleFolder.items)
        {
            if (childItem.name === exampleNotecardName)
            {
                exampleNotecard = childItem;
                break;
            }
        }

        // Create the notecard
        if (exampleNotecard === undefined)
        {
            const notecard = new LLLindenText();
            notecard.body = 'This is a notecard I made all by myself at ' + new Date().toString();
            exampleNotecard = await exampleFolder.uploadAsset(AssetType.Notecard, InventoryType.Notecard, notecard.toAsset(), exampleNotecardName, 'This is an example notecard');
        }

        // Set notecard to transfer only

        exampleNotecard.permissions.nextOwnerMask = PermissionMask.Transfer | PermissionMask.Modify;
        await exampleNotecard.update();

        let exampleScript = exampleFolder.items.find(f => f.name === exampleScriptName);
        if (exampleScript === undefined)
        {
            exampleScript = await exampleFolder.uploadAsset(
                AssetType.LSLText,
                InventoryType.LSL,
                Buffer.from(
                    'default { touch_start(integer total_number) {  llSay(0, "Hello, world!"); } } '
                    , 'utf-8'
                ),
                'Script',
                ''
            );
        }

        // Give the notecard to our owner
        await this.bot.clientCommands.comms.giveInventory(this.masterAvatar, exampleNotecard);

        // Enumerate library
        const folders = this.bot.clientCommands.inventory.getLibraryRoot().getChildFolders();
        for (const folder of folders)
        {
            await this.iterateFolder(folder, '[ROOT]');
        }
        console.log('Done iterating through library');
    }

    async onInventoryResponse(response: InventoryResponseEvent): Promise<void>
    {
        if (response.accepted)
        {
            console.log(response.fromName + ' accepted your inventory offer');
        }
        else
        {
            console.log(response.fromName + ' declined your inventory offer');
        }
    }

    async iterateFolder(folder: InventoryFolder, prefix: string): Promise<void>
    {
        console.log(prefix + ' [' + folder.name + ']');
        await folder.populate(false);

        for (const subFolder of folder.folders)
        {
            await this.iterateFolder(subFolder, prefix + ' [' + folder.name + ']');
        }

        for (const item of folder.items)
        {
            console.log(prefix + ' [' + folder.name + ']' + ': ' + item.name);

            if (item.name === 'anim SMOOTH')
            {
                // Send this to our master av

            }
        }
    }

    async onInventoryOffered(event: InventoryOfferedEvent): Promise<void>
    {
        if (event.from.toString() === this.masterAvatar)
        {
            console.log('Accepting inventory offer from ' + event.fromName);
            this.bot.clientCommands.inventory.acceptInventoryOffer(event).then(() =>
            {
            });
        }
        else
        {
            console.log('Rejecting inventory offer from ' + event.fromName);
            this.bot.clientCommands.inventory.rejectInventoryOffer(event).then(() =>
            {
            });
        }
    }
}

new Inventory().run().then(() =>
{

}).catch((err) =>
{
    console.error(err);
});
