// Here's a more modern example of how to use node-metaverse with async/await.
// Modern node.js required

require('source-map-support').install();

const nmv             = require('../dist/index');
const loginParameters = new nmv.LoginParameters();

const parameters = require('./loginParameters.json');
const uuid = require('uuid');

loginParameters.firstName = parameters.firstName;
loginParameters.lastName = parameters.lastName;
loginParameters.password = parameters.password;
loginParameters.start = parameters.start;

//const options = nmv.BotOptionFlags.None;

// If you don't intend to use the object store (i.e you have no interest in inworld objects, textures, etc,
// using nmv.BotOptionFlags.LiteObjectStore will drastically reduce the footprint and CPU usage.
//
// The full object store has a full searchable rtree index, the lite does not.
//
// For the minimum footprint, use :
//
// const options = nmv.BotOptionFlags.LiteObjectStore | nmv.BotOptionFlags.StoreMyAttachmentsOnly;

const options = nmv.BotOptionFlags.None;

const bot = new nmv.Bot(loginParameters, options);

// This will tell the bot to keep trying to teleport back to the 'stay' location.
// You can specify a region and position, such as:
// bot.stayPut(true, 'Izanagi', new nmv.Vector3([128, 128, 21]));
// Note that the 'stay' location will be updated if you request or accept a lure (a teleport).
// If no region is specified, it will be set to the region you log in to.
bot.stayPut(true);

let isConnected = false;

const master = 'd1cd5b71-6209-4595-9bf0-771bf689ce00';

let loginResponse = null;

bot.clientEvents.onLure.subscribe(async (lureEvent) =>
{
    try
    {
        const regionInfo = await bot.clientCommands.grid.getRegionMapInfo(lureEvent.gridX / 256, lureEvent.gridY / 256);
        if (lureEvent.from.toString() === master)
        {
            console.log('Accepting teleport lure to ' + regionInfo.block.name + ' (' + regionInfo.avatars.length + ' avatar' + ((regionInfo.avatars.length === 1)?'':'s') + ' present) from ' + lureEvent.fromName + ' with message: ' + lureEvent.lureMessage);
            bot.clientCommands.teleport.acceptTeleport(lureEvent).then(() => {}).catch((err) => {
                console.error('Teleport error:');
                console.error(err);
            });
        }
        else
        {
            console.log('Ignoring teleport lure to ' + regionInfo.block.name + ' (' + regionInfo.avatars.length + ' avatar' + ((regionInfo.avatars.length === 1)?'':'s') + ' present) from ' + lureEvent.fromName + ' with message: ' + lureEvent.lureMessage);
        }
    }
    catch(error)
    {
        console.error("Failed to get region map info:");
        console.error(error);
    }
});

bot.clientEvents.onInstantMessage.subscribe((IMEvent) =>
{
    if (IMEvent.source === nmv.ChatSourceType.Agent)
    {
        if (!(IMEvent.flags & nmv.InstantMessageEventFlags.startTyping || IMEvent.flags & nmv.InstantMessageEventFlags.finishTyping))
        {
            bot.clientCommands.comms.typeInstantMessage(IMEvent.from, 'Thanks for the message! This account is a scripted agent (bot), so cannot reply to your query. Sorry!').then(() => {});
        }
    }
});

bot.clientEvents.onFriendRequest.subscribe((event) =>
{
    if (event.from.toString() === master)
    {
        console.log("Accepting friend request from " + event.fromName);
        bot.clientCommands.friends.acceptFriendRequest(event).then(() => {});
    }
    else
    {
        console.log("Rejecting friend request from " + event.fromName);
        bot.clientCommands.friends.rejectFriendRequest(event).then(() => {});
    }
});

bot.clientEvents.onInventoryOffered.subscribe((event) =>
{
    if (event.from.toString() === master)
    {
        console.log("Accepting inventory offer from " + event.fromName);
        bot.clientCommands.inventory.acceptInventoryOffer(event).then(() => {});
    }
    else
    {
        console.log("Rejecting inventory offer from " + event.fromName);
        bot.clientCommands.inventory.rejectInventoryOffer(event).then(() => {});
    }
});

bot.clientEvents.onDisconnected.subscribe((DisconnectEvent) =>
{
    isConnected = false;
    console.log("Disconnected from simulator: "+DisconnectEvent.message);
    if (!DisconnectEvent.requested)
    {
        setTimeout(() =>
        {
            console.log("Reconnecting");
            connect().then(() => {});
        }, 5000)
    }
});

let pings = {};

bot.clientEvents.onGroupChat.subscribe(async (GroupChatEvent) =>
{
    console.log("Group chat: " + GroupChatEvent.fromName + ': ' + GroupChatEvent.message);
    if (GroupChatEvent.message === '!ping')
    {
        let ping = uuid.v4();
        pings[ping] = Math.floor(new Date().getTime());
        try
        {
            const memberCount = await bot.clientCommands.comms.sendGroupMessage(GroupChatEvent.groupID, 'ping '+ping);
            console.log('Group message sent to ' + memberCount + ' members');
        }
        catch(error)
        {
            console.error('Failed to send group message:');
            console.error(error);
        }
    }
    else if (GroupChatEvent.from.toString() === loginResponse.agent.agentID.toString())
    {
        if (GroupChatEvent.message.substr(0, 5) === 'ping ')
        {
            const pingID = GroupChatEvent.message.substr(5);
            if (pings[pingID])
            {
                console.log("found ping");
                const time = (new Date().getTime()) - pings[pingID];
                delete pings[pingID];
                bot.clientCommands.comms.sendGroupMessage(GroupChatEvent.groupID, 'Chat lag: ' + time + 'ms').then(() => {});
            }
            else
            {
                console.log("ping not found |"+pingID+"|");
            }
        }

    }
});

bot.clientEvents.onGroupNotice.subscribe(async(GroupNoticeEvent) =>
{
    // Get group name
    const groupProfile = await bot.clientCommands.group.getGroupProfile(GroupNoticeEvent.groupID);

    console.log('Group notice from ' + GroupNoticeEvent.fromName + ' (' + GroupNoticeEvent.from + '), from group ' + groupProfile.Name + ' (' + GroupNoticeEvent.groupID + ')');
    console.log('Subject: ' + GroupNoticeEvent.subject);
    console.log('Message: ' + GroupNoticeEvent.message);
});

bot.clientEvents.onGroupInvite.subscribe(async (GroupInviteEvent) =>
{

    console.log('Group invite from ' + GroupInviteEvent.fromName + ': '+GroupInviteEvent.message);

    //Resolve avatar key
    try
    {
        const key = await bot.clientCommands.grid.avatarName2Key(GroupInviteEvent.fromName);
        if (key.toString() === master)
        {
            console.log('Accepting');
            bot.clientCommands.group.acceptGroupInvite(GroupInviteEvent).then(() => {});
        }
        else
        {
            console.log('Unauthorised - rejecting');
            bot.clientCommands.group.rejectGroupInvite(GroupInviteEvent).then(() => {});
        }
    }
    catch(error)
    {
        console.error('Failed to respond to group invite:');
        console.error(error);
    }
});

bot.clientEvents.onFriendResponse.subscribe((response) =>
{
    if (response.accepted)
    {
        console.log(response.fromName + ' accepted your friend request');
    }
    else
    {
        console.log(response.fromName + ' declined your friend request');
    }
});

async function connect()
{
    try
    {
        console.log("Logging in..");
        loginResponse = await bot.login();

        console.log("Login complete");

        //Establish circuit with region
        await bot.connectToSim();

        console.log("Connected to simulator");
        isConnected = true;
        // Do some stuff
        //bot.clientCommands.comms.typeLocalMessage('Never fear, I am here!', 2000);
        //bot.clientCommands.group.sendGroupNotice('503e8ef6-e119-ff5e-2524-24f290dd3867', 'Test', 'testy testy test');

        // Group invite example
        // Just omit the role parameter for "everyone" role
        //
        // bot.clientCommands.group.sendGroupInvite("c6424e05-6e2c-fb03-220b-ca7904d11e04", "d1cd5b71-6209-4595-9bf0-771bf689ce00");

        // Advanced group invite example
        //
        // Retrieve group roles

        const userToInvite = new nmv.UUID("d1cd5b71-6209-4595-9bf0-771bf689ce00");
        const groupID      = new nmv.UUID("c6424e05-6e2c-fb03-220b-ca7904d11e04");

        // If you want to wait here for the request to be acknowledged, you can add "await"
        bot.clientCommands.friends.sendFriendRequest(master, 'Be friends with me?').then(() => {});

        const folders = bot.clientCommands.inventory.getInventoryRoot().getChildFolders();
        folders.forEach((folder) =>
        {
            console.log('Top level folder: ' + folder.name);
            folder.populate().then(() => {});
        });

        const roles = await bot.clientCommands.group.getGroupRoles(groupID);
        roles.forEach(async (role) =>
        {
            if (role.Name === 'Officers')
            {
                // IMPORTANT: IN PRODUCTION, IT IS HIGHLY RECOMMENDED TO CACHE THIS LIST.
                //
                try
                {
                    const members = await bot.clientCommands.group.getMemberList(groupID);
                    let found = true;
                    members.forEach((member) =>
                    {
                        if (member.AgentID.toString() === userToInvite.toString())
                        {
                            found = true;
                        }
                    });
                    if (found)
                    {
                        console.log("User already in group, skipping invite");
                    }
                    else
                    {
                        bot.clientCommands.group.sendGroupInvite(groupID, userToInvite, role.RoleID).then(() => {});
                    }
                }
                catch(error)
                {
                    console.error('Error retrieving member list for group invite');
                }
            }
        });

        await bot.waitForEventQueue();
        try
        {
            // Get map location of Casper Warden (should (hopefully)! fail if you don't have map rights on me..
            const regionLocation = await bot.clientCommands.friends.getFriendMapLocation('d1cd5b71-6209-4595-9bf0-771bf689ce00');
            console.log('Casper is in ' + regionLocation.regionName + ' at <' + regionLocation.localX + ', ' + regionLocation.localY + '> and there are ' + regionLocation.avatars.length + ' other avatars there too! You stalker!');

        }
        catch(error)
        {
            console.log('Map location request failed. You probably do not have map rights on Casper, or he is offline.');
        }

        // By default, camera view distance is set to 1, to minimise memory and bandwidth consumption.
        // This algorithm will slowly drag the camera up into the sky, scanning for objects.
        let height = 64;
        let lastObjects = 0;

        bot.clientCommands.agent.setCamera(
            new nmv.Vector3([128, 128, height]),
            new nmv.Vector3([128, 128, 0]),
            256,
            new nmv.Vector3([-1.0, 0, 0]),
            new nmv.Vector3([0.0, 1.0, 0]));


        // Get group member list
        try
        {
            const memberList = await bot.clientCommands.group.getMemberList('f0466f71-abf4-1559-db93-50352d13ae74');
        }
        catch (error)
        {
            // Probably access denied
            console.error(error);
        }

        // Get group ban list
        try
        {
            const banList = await bot.clientCommands.group.getBanList('f0466f71-abf4-1559-db93-50352d13ae74');
        }
        catch (error)
        {
            // Probably access denied
            console.error(error);
        }


        // Moderate group member
        try
        {
            const groupKey = '4b35083d-b51a-a148-c400-6f1038a5589e';
            const avatarKey = '4300b952-d20e-4aa5-b3d6-d2e4d675880d';

            // Note this will start a new group chat session if one does not already exist
            await bot.clientCommands.comms.moderateGroupChat(groupKey, avatarKey, true, true);

            // Now, the group mute stuff is often pretty useless because an avatar can just leave the session and re-join.
            // Let's enforce it a little better.
            const groupChatSubscriber = bot.clientEvents.onGroupChatAgentListUpdate.subscribe((event) =>
            {
                if (event.groupID.toString() === groupKey && event.agentID.toString() === avatarKey && event.entered)
                {
                    bot.clientCommands.comms.moderateGroupChat(groupKey, avatarKey, true, true).then(() =>
                    {
                        console.log('Re-enforced mute on ' + avatarKey);
                    }).catch((err) =>
                    {
                       console.error(err);
                    });
                }
            });

            // Send a group message
            await bot.clientCommands.comms.sendGroupMessage(groupKey, 'Test');
        }
        catch (error)
        {
            console.error(error);
        }

        //await bot.clientCommands.friends.grantFriendRights('d1cd5b71-6209-4595-9bf0-771bf689ce00', nmv.RightsFlags.CanModifyObjects | nmv.RightsFlags.CanSeeOnline | nmv.RightsFlags.CanSeeOnMap );

        const parcelInMiddle = await bot.clientCommands.region.getParcelAt(128, 128);
        console.log('Parcel at 128x128 is ' + parcelInMiddle.Name);

        const parcels = await bot.clientCommands.region.getParcels();
        console.log('Parcels on region:');
        console.log('========================');
        for (const p of parcels)
        {
            console.log(p.Name);
        }
        console.log('========================');
    }
    catch (error)
    {
        isConnected = false;
        console.log("Error:");
        console.error(error);
        setTimeout(() =>
        {
            connect().then(() => {});
        }, 5000)
    }
}

try
{
    connect().then(() => {});
}
catch(error)
{
    console.error('Connection failure: ');
    console.log(error);
}


async function exitHandler(options, err)
{
    if (err)
    {
        console.log(err.stack);
    }
    if (isConnected)
    {
        console.log("Disconnecting");
        try
        {
            await bot.close();
        }
        catch(error)
        {
            console.error('Error when closing client:');
            console.error(error);
        }
        process.exit();
        return;
    }
    if (options.exit)
    {
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid"
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
