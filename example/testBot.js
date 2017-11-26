const nmv             = require('../dist/index');
const loginParameters = new nmv.LoginParameters();

const parameters = require('./loginParameters.json');

loginParameters.firstName = parameters.firstName;
loginParameters.lastName = parameters.lastName;
loginParameters.password = parameters.password;
loginParameters.start = "last";

const bot = new nmv.Bot(loginParameters);

let resp = null;

bot.login().then((response) =>
{
    //Establish circuit wit region
    resp = response;
    return bot.connectToSim();
}).then(() =>
{
    let it = 0;
    setInterval(() =>
    {
        it++;
        if (it < 11)
        {
            bot.sendInstantMessage("dbcd7dfe-a5db-4736-91bc-2af1e69902e6", "Test " + it);
            bot.sendInstantMessage("d1cd5b71-6209-4595-9bf0-771bf689ce00", "Test " + it);
        }
    }, 1000);
}).then(() =>
{
    console.log("IM 1 Sent");
}).then(() =>
{
    //console.log("Logging off");
    //return bot.close();
}).catch((error) =>
{
    console.log("Error:");
    console.error(error);
});

