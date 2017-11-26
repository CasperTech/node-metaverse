const nmv             = require('../dist/index');
const loginParameters = new nmv.LoginParameters();

const parameters = require('./loginParameters.json');

loginParameters.firstName = parameters.firstName;
loginParameters.lastName = parameters.lastName;
loginParameters.password = parameters.password;
loginParameters.start = "last";

const bot = new nmv.Bot(loginParameters);

let resp = null;

bot.Login().then((response) =>
{
    //Establish circuit wit region
    resp = response;
    return response.region.circuit.establish(response.agent.agentID);
}).then(() =>
{
    resp.region.circuit.sendInstantMessage(resp.agent.agentID, "dbcd7dfe-a5db-4736-91bc-2af1e69902e6", "FUCK YOU");
}).catch((error) =>
{
    console.log("Error:");
    console.error(error);
});

