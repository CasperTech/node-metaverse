const nmv             = require('../dist/index');
const loginParameters = new nmv.LoginParameters();

const parameters = require('./loginParameters.json');
const fs = require('fs');

loginParameters.firstName = parameters.firstName;
loginParameters.lastName = parameters.lastName;
loginParameters.password = parameters.password;
loginParameters.start = "last";

const bot = new nmv.Bot(loginParameters);

let resp = null;

function connect()
{
    bot.login().then((response) =>
    {
        bot.clientEvents.onLure.subscribe((lureEvent) =>
        {
            bot.clientCommands.grid.getRegionMapInfo(lureEvent.gridX, lureEvent.gridY).then((regionInfo) =>
            {
                console.log('Auto-accepting teleport lure to ' + regionInfo.name + ' (' + regionInfo.avatars.length + ' avatar' + ((regionInfo.avatars.length === 1)?'':'s') + ' present) from ' + lureEvent.fromName + ' with message: ' + lureEvent.lureMessage);
                //bot.clientCommands.teleport.acceptTeleport(lureEvent);
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

        //Establish circuit wit region
        resp = response;
        return bot.connectToSim();
    }).then(() =>
    {
        // Do some stuff
        //bot.clientCommands.comms.typeLocalMessage('Never fear, I am here!', 2000);
        //bot.clientCommands.group.sendGroupNotice('503e8ef6-e119-ff5e-2524-24f290dd3867', 'Test', 'testy testy test');

        // When it's time to go home, call bot.close();
    }).catch((error) =>
    {
        console.log("Error:");
        console.error(error);
        setTimeout(() =>
        {
            connect();
        }, 5000)
    });
}

connect();
