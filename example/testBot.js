const nmv             = require('../dist/index');
const loginParameters = new nmv.LoginParameters();

const parameters = require('./loginParameters.json');
const uuid = require('uuid');

loginParameters.firstName = parameters.firstName;
loginParameters.lastName = parameters.lastName;
loginParameters.password = parameters.password;
loginParameters.start = "last";

//const options = nmv.BotOptionFlags.None;

// If you don't intend to use the object store (i.e you have no interest in inworld objects, textures, etc,
// using ObjectStoreLite will drastically reduce the footprint
//
const options = nmv.BotOptionFlags.LiteObjectStore | nmv.BotOptionFlags.StoreMyAttachmentsOnly;

const bot = new nmv.Bot(loginParameters, options);

let isConnected = false;

const master = 'd1cd5b71-6209-4595-9bf0-771bf689ce00';

let loginResponse = null;

bot.clientEvents.onLure.subscribe((lureEvent) =>
{
    bot.clientCommands.grid.getRegionMapInfo(lureEvent.gridX, lureEvent.gridY).then((regionInfo) =>
    {
        if (lureEvent.from.toString() === master)
        {
            console.log('Accepting teleport lure to ' + regionInfo.name + ' (' + regionInfo.avatars.length + ' avatar' + ((regionInfo.avatars.length === 1)?'':'s') + ' present) from ' + lureEvent.fromName + ' with message: ' + lureEvent.lureMessage);
            bot.clientCommands.teleport.acceptTeleport(lureEvent);
        }
        else
        {
            console.log('Ignoring teleport lure to ' + regionInfo.name + ' (' + regionInfo.avatars.length + ' avatar' + ((regionInfo.avatars.length === 1)?'':'s') + ' present) from ' + lureEvent.fromName + ' with message: ' + lureEvent.lureMessage);
        }
    });
});

bot.clientEvents.onInstantMessage.subscribe((IMEvent) =>
{
    if (IMEvent.source === nmv.ChatSourceType.Agent)
    {
        if (!(IMEvent.flags & nmv.InstantMessageEventFlags.startTyping || IMEvent.flags & nmv.InstantMessageEventFlags.finishTyping))
        {
            bot.clientCommands.comms.typeInstantMessage(IMEvent.from, 'Thanks for the message! This account is a scripted agent (bot), so cannot reply to your query. Sorry!');
        }
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
            connect();
        }, 5000)
    }
});

let pings = {};

bot.clientEvents.onGroupChat.subscribe((GroupChatEvent) =>
{
   console.log("Group chat: " + GroupChatEvent.fromName + ': ' + GroupChatEvent.message);
   if (GroupChatEvent.message === '!ping')
   {
       let ping = uuid.v4();
       pings[ping] = Math.floor(new Date().getTime());
       bot.clientCommands.comms.sendGroupMessage(GroupChatEvent.groupID, 'ping '+ping);
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
               bot.clientCommands.comms.sendGroupMessage(GroupChatEvent.groupID, 'Chat lag: ' + time + 'ms');
           }
           else
           {
               console.log("ping not found |"+pingID+"|");
           }
       }

   }
});

bot.clientEvents.onGroupInvite.subscribe((GroupInviteEvent) =>
{

    console.log('Group invite from ' + GroupInviteEvent.fromName + ': '+GroupInviteEvent.message);

    //Resolve avatar key
    bot.clientCommands.grid.name2Key(GroupInviteEvent.fromName).then((key) =>
    {
        if (key.toString() === master)
        {
            console.log('Accepting');
            bot.clientCommands.comms.acceptGroupInvite(GroupInviteEvent);
        }
        else
        {
            console.log('Unauthorised - rejecting');
            bot.clientCommands.comms.rejectGroupInvite(GroupInviteEvent);
        }
    }).catch((err) =>
    {
        console.error(err);
        console.log('Unknown avatar - rejecting');
        bot.clientCommands.comms.rejectGroupInvite(GroupInviteEvent);
    });
});

function connect()
{
    console.log("Logging in..");
    bot.login().then((response) =>
    {
        loginResponse = response;
        console.log("Login complete");

        //Establish circuit with region
        return bot.connectToSim();
    }).then(() =>
    {
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
        const groupID = new nmv.UUID("c6424e05-6e2c-fb03-220b-ca7904d11e04");

        bot.clientCommands.group.getGroupRoles(groupID).then((roles) =>
        {
            roles.forEach((role) =>
            {
                if (role.Name === 'Officers')
                {
                    // IMPORTANT: IN PRODUCTION, IT IS HIGHLY RECOMMENDED TO CACHE THIS LIST.
                    //
                    bot.clientCommands.group.getMemberList(groupID).then((members) =>
                    {
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
                            bot.clientCommands.group.sendGroupInvite(groupID, userToInvite , role.RoleID);
                        }
                    });
                }
            });
        });

        // When it's time to go home, call bot.close();
    }).catch((error) =>
    {
        isConnected = false;
        console.log("Error:");
        console.error(error);
        setTimeout(() =>
        {
            connect();
        }, 5000)
    });
}

connect();


function exitHandler(options, err)
{
    if (err)
    {
        console.log(err.stack);
    }
    if (isConnected)
    {
        console.log("Disconnecting");
        bot.close().then(() =>
        {
            process.exit()
        });
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

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));