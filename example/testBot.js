const nmv             = require('../dist/index');
const loginParameters = new nmv.LoginParameters();

const parameters = require('./loginParameters.json');

loginParameters.firstName = parameters.firstName;
loginParameters.lastName = parameters.lastName;
loginParameters.password = parameters.password;
loginParameters.start = "last";

const bot = new nmv.Bot(loginParameters);

bot.Login().then((response) =>
{
    //Establish circuit wit region
    return response.region.circuit.establish(response.agent.agentID);
}).then(() =>
{
    console.log("Region circuit established");
}).catch((error) =>
{
    console.log("Error:");
    console.error(error);
});

