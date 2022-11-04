import { ExampleBot } from '../ExampleBot';
import { FriendRequestEvent } from '../../lib/events/FriendRequestEvent';
import { FriendResponseEvent } from '../../lib/events/FriendResponseEvent';

class Friends extends ExampleBot
{
    async onConnected(): Promise<void>
    {
        this.bot.clientEvents.onFriendRequest.subscribe(this.onFriendRequest.bind(this));
        this.bot.clientEvents.onFriendResponse.subscribe(this.onFriendResponse.bind(this));

        this.bot.clientCommands.friends.sendFriendRequest(this.masterAvatar, 'Be friends with me?').then(() =>
        {

        });

        try
        {
            // Get map location of the master avatar. Will fail if you don't have map rights
            const regionLocation = await this.bot.clientCommands.friends.getFriendMapLocation(this.masterAvatar);
            console.log('Master is in ' + regionLocation.regionName + ' at <' + regionLocation.localX + ', ' + regionLocation.localY + '> and there are ' + regionLocation.avatars.length + ' other avatars there too! You stalker!');
        }
        catch (error)
        {
            console.log('Map location request failed. The bot probably does not have map rights on the master avatar, or they are offline.');
        }
    }

    async onFriendRequest(event: FriendRequestEvent): Promise<void>
    {
        if (event.from.toString() === this.masterAvatar)
        {
            console.log('Accepting friend request from ' + event.fromName);
            this.bot.clientCommands.friends.acceptFriendRequest(event).then(() =>
            {
            });
        }
        else
        {
            console.log('Rejecting friend request from ' + event.fromName);
            this.bot.clientCommands.friends.rejectFriendRequest(event).then(() =>
            {
            });
        }
    }

    async onFriendResponse(response: FriendResponseEvent): Promise<void>
    {
        if (response.accepted)
        {
            console.log(response.fromName + ' accepted your friend request');
        }
        else
        {
            console.log(response.fromName + ' declined your friend request');
        }
    }

}

new Friends().run().then(() =>
{

}).catch((err) =>
{
    console.error(err);
});
