import { ExampleBot } from '../ExampleBot';
import { UUID } from '../../lib/classes/UUID';
import { GroupChatEvent } from '../../lib/events/GroupChatEvent';

class GroupChat extends ExampleBot
{
    private pings: {[key: string]: number} = {};

    async onConnected()
    {
        const groupID = new UUID('4b35083d-b51a-a148-c400-6f1038a5589e');

        this.bot.clientEvents.onGroupChat.subscribe(this.onGroupChat.bind(this));

        // Start a group chat session - equivalent to opening a group chat but not sending a message
        await this.bot.clientCommands.comms.startGroupChatSession(groupID, '');

        // Send a group message
        await this.bot.clientCommands.comms.sendGroupMessage(groupID, 'Test');

        const badGuyID = new UUID('1481561a-9113-46f8-9c02-9ac1bf005de7');
        await this.bot.clientCommands.comms.moderateGroupChat(groupID, badGuyID, true, true);

        // Now, the group mute stuff is often pretty useless because an avatar can just leave the session and re-join.
        // Let's enforce it a little better.
        const groupChatSubscriber = this.bot.clientEvents.onGroupChatAgentListUpdate.subscribe((event) =>
        {
            if (event.groupID.equals(groupID) && event.agentID.equals(badGuyID) && event.entered)
            {
                this.bot.clientCommands.comms.moderateGroupChat(groupID, badGuyID, true, true).then(() =>
                {
                    console.log('Re-enforced mute on ' + badGuyID.toString());
                }).catch((err) =>
                {
                    console.error(err);
                });
            }
        });

        // Actually, maybe we want to ban the chump.
        await this.bot.clientCommands.group.banMembers(groupID, [badGuyID]);
        await this.bot.clientCommands.group.ejectFromGroup(groupID, badGuyID);
    }

    async onGroupChat(event: GroupChatEvent)
    {
        console.log('Group chat: ' + event.fromName + ': ' + event.message);
        if (event.message === '!ping')
        {
            const ping = UUID.random().toString();
            this.pings[ping] = Math.floor(new Date().getTime());
            try
            {
                const memberCount = await this.bot.clientCommands.comms.sendGroupMessage(event.groupID, 'ping ' + ping);
                console.log('Group message sent to ' + memberCount + ' members');
            }
            catch (error)
            {
                console.error('Failed to send group message:');
                console.error(error);
            }
        }
        else if (event.from.toString() === this.bot.agentID().toString())
        {
            if (event.message.substr(0, 5) === 'ping ')
            {
                const pingID = event.message.substr(5);
                if (this.pings[pingID])
                {
                    const time = (new Date().getTime()) - this.pings[pingID];
                    delete this.pings[pingID];
                    await this.bot.clientCommands.comms.sendGroupMessage(event.groupID, 'Chat lag: ' + time + 'ms');
                }
            }

        }
    }
}

new GroupChat().run().then(() => {}).catch((err: Error) => { console.error(err) });
