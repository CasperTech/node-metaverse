import { ExampleBot } from '../ExampleBot';
import { LandStatReportType } from '../../lib/enums/LandStatReportType';
import { LandStatFlags } from '../../lib/enums/LandStatFlags';

class Parcels extends ExampleBot
{
    async onConnected(): Promise<void>
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
        const stats = await this.bot.clientCommands.parcel.getLandStats(parcels[0].ParcelID, LandStatReportType.Scripts, LandStatFlags.FilterByOwner);
        console.log(JSON.stringify(stats, null, 4));
    }
}

new Parcels().run().then(() =>
{

}).catch((err) =>
{
    console.error(err);
});
