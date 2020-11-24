import { ExampleBot } from '../ExampleBot';
import { SimStatsEvent } from '../../lib/events/SimStatsEvent';

class Region extends ExampleBot
{
    async onConnected()
    {
        this.bot.clientEvents.onSimStats.subscribe(this.onSimStats.bind(this));
    }

    onSimStats(stats: SimStatsEvent)
    {
        console.log(JSON.stringify(stats, null, 4));
    }
}

new Region().run().then(() => {}).catch((err) => { console.error(err) });
