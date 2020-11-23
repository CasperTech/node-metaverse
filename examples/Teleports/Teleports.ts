import { ExampleBot } from '../ExampleBot';
import { LureEvent } from '../../lib/events/LureEvent';

class Teleports extends ExampleBot
{
    async onConnected()
    {
        // "OnLure" event fires when someone tries to teleport us
        this.bot.clientEvents.onLure.subscribe(this.onLure.bind(this));

        // Alternatively we can TP someone else to us
        await this.bot.clientCommands.comms.sendTeleport(this.masterAvatar);
    }

    async onLure(lureEvent: LureEvent)
    {
        try
        {
            const regionInfo = await this.bot.clientCommands.grid.getRegionMapInfo(lureEvent.gridX / 256, lureEvent.gridY / 256);
            if (lureEvent.from.toString() === this.masterAvatar)
            {
                console.log('Accepting teleport lure to ' + regionInfo.block.name + ' (' + regionInfo.avatars.length + ' avatar' + ((regionInfo.avatars.length === 1) ? '' : 's') + '' +
                    ' present) from ' + lureEvent.fromName + ' with message: ' + lureEvent.lureMessage);
                try
                {
                    await this.bot.clientCommands.teleport.acceptTeleport(lureEvent);
                }
                catch (error)
                {
                    console.error('Teleport error:');
                    console.error(error);
                }
            }
            else
            {
                console.log('Ignoring teleport lure to ' + regionInfo.block.name + ' (' + regionInfo.avatars.length + ' avatar' + ((regionInfo.avatars.length === 1) ? '' : 's') + ' ' +
                    'present) from ' + lureEvent.fromName + ' with message: ' + lureEvent.lureMessage);
            }
        }
        catch (error)
        {
            console.error('Failed to get region map info:');
            console.error(error);
        }
    }
}

new Teleports().run().then(() => {}).catch((err) => { console.error(err) });
