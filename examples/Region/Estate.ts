import { ExampleBot } from '../ExampleBot';

class Estate extends ExampleBot
{
    wait(ms: number): Promise<void>
    {
        return new Promise<void>((resolve) =>
        {
            setTimeout(() =>
            {
                resolve();
            }, ms)
        });
    }
    async onConnected(): Promise<void>
    {
        console.log('Sending a message');
        await this.bot.clientCommands.region.simulatorMessage('In about 10 seconds, the region will begin to restart. This is only a test, and the restart will be cancelled.');
        await this.wait(10000);
        console.log('Restarting');
        await this.bot.clientCommands.region.restartRegion(120);
        await this.wait(10000);
        console.log('Canceling restart');
        await this.bot.clientCommands.region.cancelRestart();
    }
}

new Estate().run().then(() =>
{

}).catch((err) =>
{
    console.error(err);
});
