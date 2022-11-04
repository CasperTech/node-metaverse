import { ExampleBot } from '../ExampleBot';
import { Vector3 } from '../../lib/classes/Vector3';

class Camera extends ExampleBot
{
    async onConnected(): Promise<void>
    {
        const height = 64;
        this.bot.clientCommands.agent.setCamera(
            new Vector3([128, 128, height]),
            new Vector3([128, 128, 0]),
            256,
            new Vector3([-1.0, 0, 0]),
            new Vector3([0.0, 1.0, 0]));
    }
}

new Camera().run().then(() =>
{

}).catch((err) =>
{
    console.error(err)
});
