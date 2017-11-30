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

bot.login().then((response) =>
{
    bot.clientEvents.onLure.subscribe((lureEvent) =>
    {
        bot.getRegionMapInfo(lureEvent.gridX, lureEvent.gridY).then((regionInfo) =>
        {
            console.log('Auto-accepting teleport lure to ' + regionInfo.name + ' (' + regionInfo.avatars.length + ' avatar' + ((regionInfo.avatars.length === 1)?'':'s') + ' present) from ' + lureEvent.fromName + ' with message: ' + lureEvent.lureMessage);
            bot.acceptTeleport(lureEvent);
        });
    });

    //Establish circuit wit region
    resp = response;
    return bot.connectToSim();
}).then(() =>
{
    // Do some stuff

    // When it's time to go home, call bot.close();
}).catch((error) =>
{
    console.log("Error:");
    console.error(error);
});

