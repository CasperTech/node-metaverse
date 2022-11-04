import { ExampleBot } from '../ExampleBot';
import { UUID } from '../../lib/classes/UUID';
import { GroupNoticeEvent } from '../../lib/events/GroupNoticeEvent';

class Group extends ExampleBot
{
    async onConnected(): Promise<void>
    {
        this.bot.clientEvents.onGroupNotice.subscribe(this.onGroupNotice.bind(this));

        // Group invite example
        // Just omit the role parameter for "everyone" role
        //
        // bot.clientCommands.group.sendGroupInvite("c6424e05-6e2c-fb03-220b-ca7904d11e04", "d1cd5b71-6209-4595-9bf0-771bf689ce00");

        // Advanced group invite example
        //

        const userToInvite = new UUID('d1cd5b71-6209-4595-9bf0-771bf689ce00');
        const groupID = new UUID('4b35083d-b51a-a148-c400-6f1038a5589e');

        // Retrieve group roles
        const roles = await this.bot.clientCommands.group.getGroupRoles(groupID);

        for (const role of roles)
        {
            if (role.Name === 'Officers')
            {
                // IMPORTANT: IN PRODUCTION, IT IS HIGHLY RECOMMENDED TO CACHE THIS LIST.
                //
                try
                {
                    const members = await this.bot.clientCommands.group.getMemberList(groupID);
                    let found = true;
                    for (const member of members)
                    {
                        if (member.AgentID.toString() === userToInvite.toString())
                        {
                            found = true;
                        }
                    }
                    if (found)
                    {
                        console.log('User already in group, skipping invite');
                    }
                    else
                    {
                        this.bot.clientCommands.group.sendGroupInvite(groupID, userToInvite, role.RoleID).then(() =>
                        {
                        });
                    }
                }
                catch (error)
                {
                    console.error('Error retrieving member list for group invite');
                }
            }
        }

        // Get group member list
        try
        {
            const memberList = await this.bot.clientCommands.group.getMemberList(groupID);
            console.log(memberList.length + ' members in member list');
        }
        catch (error)
        {
            // Probably access denied
            console.error(error);
        }

        // Get group ban list
        try
        {
            const banList = await this.bot.clientCommands.group.getBanList(groupID);
            console.log(banList.length + ' members in ban list');
        }
        catch (error)
        {
            // Probably access denied
            console.error(error);
        }
    }

    async onGroupNotice(event: GroupNoticeEvent): Promise<void>
    {
        // Get group name
        const groupProfile = await this.bot.clientCommands.group.getGroupProfile(event.groupID);

        console.log('Group notice from ' + event.fromName + ' (' + event.from + '), from group ' + groupProfile.Name + ' (' + event.groupID + ')');
        console.log('Subject: ' + event.subject);
        console.log('Message: ' + event.message);
    }
}

new Group().run().then(() =>
{

}).catch((err: Error) =>
{
    console.error(err);
});
