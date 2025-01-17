import { ExampleBot } from '../ExampleBot';
import type { GameObject} from '../../lib';
import { Utils } from '../../lib';

class TaskInventory extends ExampleBot
{
    public async onConnected(): Promise<void>
    {
        let attachments: GameObject[] = [];
        while(!attachments.length)
        {
            await Utils.sleep(1000);
            attachments = this.bot.currentRegion.objects.getObjectsByParent(this.bot.agent.localID);
        }
        console.log('Got ' + attachments.length + ' attachments');

        for(const obj of attachments)
        {
            await obj.updateInventory();
            for(const task of obj.inventory)
            {
                console.log('Found task inventory item ' + task.name);
            }
        }

        console.log('Finished!');
    }
}

new TaskInventory().run().then(() =>
{

}).catch((err: unknown) =>
{
    console.error(err);
});
