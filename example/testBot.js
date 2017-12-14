const nmv             = require('../dist/index');
const loginParameters = new nmv.LoginParameters();

const parameters = require('./loginParameters.json');

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

function connect()
{
    console.log("Logging in..");
    bot.login().then((response) =>
    {
        console.log("Login complete");

        //Establish circuit with region
        return bot.connectToSim();
    }).then(() =>
    {
        isConnected = true;
        // Do some stuff
        //bot.clientCommands.comms.typeLocalMessage('Never fear, I am here!', 2000);
        //bot.clientCommands.group.sendGroupNotice('503e8ef6-e119-ff5e-2524-24f290dd3867', 'Test', 'testy testy test');

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
    if (isConnected)
    {
        console.log("Disconnecting");
        bot.close().then(() =>
        {
            process.exit()
        });
        return;
    }
    if (err)
    {
        console.log(err.stack);
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