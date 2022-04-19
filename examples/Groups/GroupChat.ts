import { GroupChatSessionJoinEvent, GroupChatEvent, UUID } from '../../lib';
import { GroupChatClosedEvent } from '../../lib/events/GroupChatClosedEvent';
import { ExampleBot } from '../ExampleBot';

class GroupChat extends ExampleBot
{
    private pings: {
        [key: string]: number
    } = {};

    async onConnected(): Promise<void>
    {
        const groupID = new UUID('4b35083d-b51a-a148-c400-6f1038a5589e');

        this.bot.clientEvents.onGroupChat.subscribe(this.onGroupChat.bind(this));

        // Start a group chat session - equivalent to opening a group chat but not sending a message
        await this.bot.clientCommands.comms.startGroupChatSession(groupID, '');

        const badGuyID = new UUID('1481561a-9113-46f8-9c02-9ac1bf005de7');
        await this.bot.clientCommands.comms.moderateGroupChat(groupID, badGuyID, true, true);

        // Now, the group mute stuff is often pretty useless because an avatar can just leave the session and re-join.
        // Let's enforce it a little better.
        // @ts-ignore
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

        this.bot.clientEvents.onGroupChatSessionJoin.subscribe((event: GroupChatSessionJoinEvent) =>
        {
            if (event.success)
            {
                console.log('We have joined a chat session! Group ID: ' + event.sessionID);
            }
            else
            {
                console.log('We have FAILED to join a chat session! Group ID: ' + event.sessionID);
            }
        });

        this.bot.clientEvents.onGroupChatClosed.subscribe((event: GroupChatClosedEvent) =>
        {
            console.log('Group chat session closed! Group ID: ' + event.groupID.toString());
        });

        // Actually, maybe we want to ban the chump.
        await this.bot.clientCommands.group.banMembers(groupID, [badGuyID]);
        await this.bot.clientCommands.group.ejectFromGroup(groupID, badGuyID);
    }

    async onGroupChat(event: GroupChatEvent): Promise<void>
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
        else if (event.message === '!rejoin')
        {
            console.log('Leaving the session..');
            await this.bot.clientCommands.comms.endGroupChatSession(event.groupID);
            console.log('Session terminated');
            console.log('Rejoining session');
            await this.bot.clientCommands.comms.startGroupChatSession(event.groupID, '');
            await this.bot.clientCommands.comms.sendGroupMessage(event.groupID, 'I am back!');
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

new GroupChat().run().then(() =>
{

}).catch((err: Error) =>
{
    console.error(err)
});
