import { ExampleBot } from '../ExampleBot';

class Parcels extends ExampleBot
{
    async onConnected()
    {
        const parcelInMiddle = await this.bot.clientCommands.region.getParcelAt(128, 128);
        console.log('Parcel at 128x128 is ' + parcelInMiddle.Name);

        const parcels = await this.bot.clientCommands.region.getParcels();
        console.log('Parcels on region:');
        console.log('========================');
        for (const p of parcels)
        {
            console.log(p.Name);
        }
        console.log('========================');
    }
}

new Parcels().run().then(() => {}).catch((err) => { console.error(err) });
