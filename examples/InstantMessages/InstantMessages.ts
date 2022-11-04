
import { ExampleBot } from '../ExampleBot';
import { InstantMessageEvent } from '../../lib/events/InstantMessageEvent';
import { ChatSourceType } from '../../lib/enums/ChatSourceType';
import { InstantMessageEventFlags } from '../../lib/enums/InstantMessageEventFlags';

class InstantMessages extends ExampleBot
{
    constructor()
    {
        super();
    }

    async onConnected(): Promise<void>
    {
        this.bot.clientEvents.onInstantMessage.subscribe(this.onInstantMessage.bind(this));
    }

    async onInstantMessage(event: InstantMessageEvent): Promise<void>
    {
        if (event.source === ChatSourceType.Agent)
        {
            if (!(event.flags & InstantMessageEventFlags.startTyping || event.flags & InstantMessageEventFlags.finishTyping))
            {
                // typeInstantMessage will emulate a human-ish typing speed
                await this.bot.clientCommands.comms.typeInstantMessage(event.from, 'Thanks for the message! This account is a scripted agent (bot), so cannot reply to your query. Sorry!');

                // sendInstantMessage will send it instantly
                await this.bot.clientCommands.comms.sendInstantMessage(event.from, 'Of course I still love you!');
            }
        }
    }
}

new InstantMessages().run().then(() =>
{

}).catch((err: Error) =>
{
    console.error(err);
});
