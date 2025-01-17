import { ExampleBot } from '../ExampleBot';

class Region extends ExampleBot
{
    async onConnected(): Promise<void>
    {
        console.log('Exporting:');
        console.log(this.bot.currentRegion.exportXML());
        console.log('done');
    }
}

new Region().run().then(() =>
{

}).catch((err) =>
{
    console.error(err);
});
