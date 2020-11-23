import Signals = NodeJS.Signals;
import Timeout = NodeJS.Timeout;

import * as path from 'path';
import { LoginResponse } from '../lib/classes/LoginResponse';
import { Bot } from '../lib/Bot';
import { LoginParameters } from '../lib/classes/LoginParameters';
import { BotOptionFlags } from '../lib/enums/BotOptionFlags';

export class ExampleBot
{
    protected masterAvatar = 'd1cd5b71-6209-4595-9bf0-771bf689ce00';
    protected isConnected = false;
    protected isConnecting = false;
    protected loginResponse?: LoginResponse;

    protected bot: Bot;
    private reconnectTimer?: Timeout;

    constructor()
    {
        const loginParameters = new LoginParameters();
        const parameters = require(path.join(__dirname, '..', '..', 'examples', 'loginParameters.json'));
        loginParameters.firstName = parameters.firstName;
        loginParameters.lastName = parameters.lastName;
        loginParameters.password = parameters.password;
        loginParameters.start = parameters.start;

        // If you don't intend to use the object store (i.e you have no interest in inworld objects, textures, etc,
        // using nmv.BotOptionFlags.LiteObjectStore will drastically reduce the footprint and CPU usage.
        //
        // The full object store has a full searchable rtree index, the lite does not.
        //
        // For the minimum footprint, use :
        //
        // const options = nmv.BotOptionFlags.LiteObjectStore | nmv.BotOptionFlags.StoreMyAttachmentsOnly;

        const options = BotOptionFlags.None;

        this.bot = new Bot(loginParameters, options);

        // This will tell the bot to keep trying to teleport back to the 'stay' location.
        // You can specify a region and position, such as:
        // bot.stayPut(true, 'Izanagi', new nmv.Vector3([128, 128, 21]));
        // Note that the 'stay' location will be updated if you request or accept a lure (a teleport).
        // If no region is specified, it will be set to the region you log in to.
        this.bot.stayPut(true);
    }

    public async run()
    {
        const exitHandler = async(options: { exit?: boolean }, err: Error | number | Signals) =>
        {
            if (err && err instanceof Error)
            {
                console.log(err.stack);
            }
            if (this.isConnected)
            {
                console.log('Disconnecting');
                try
                {
                    await this.bot.close();
                }
                catch (error)
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



        // Do something when app is closing
        process.on('exit', exitHandler.bind(this, {}));

        // Catches ctrl+c event
        process.on('SIGINT', exitHandler.bind(this, { exit: true }));

        // Catches "kill pid"
        process.on('SIGUSR1', exitHandler.bind(this, { exit: true }));
        process.on('SIGUSR2', exitHandler.bind(this, { exit: true }));

        // Catches uncaught exceptions
        process.on('uncaughtException', exitHandler.bind(this, { exit: true }));

        await this.login();
    }

    protected async onConnected()
    {

    }

    private async login()
    {
        if (this.isConnecting)
        {
            return;
        }
        this.isConnecting = true;
        try
        {
            if (this.reconnectTimer !== undefined)
            {
                clearInterval(this.reconnectTimer);
            }
            this.reconnectTimer = setInterval(this.reconnectCheck.bind(this), 60000);

            console.log('Logging in..');
            this.loginResponse = await this.bot.login();

            console.log('Login complete');

            // Establish circuit with region
            await this.bot.connectToSim();

            console.log('Waiting for event queue');
            await this.bot.waitForEventQueue();

            this.isConnected = true;
        }
        finally
        {
            this.isConnecting = false;
        }
        return this.connected();
    }

    private async reconnectCheck()
    {
        if (!this.isConnected)
        {
            await this.login();
        }
    }

    private async connected()
    {
        this.bot.clientEvents.onDisconnected.subscribe((event) =>
        {
            if (event.requested)
            {
                if (this.reconnectTimer !== undefined)
                {
                    clearInterval(this.reconnectTimer);
                }
            }
            this.isConnected = false;
            console.log('Disconnected from simulator: ' + event.message);
        });
        await this.onConnected();
    }

    private async close()
    {
        if (this.reconnectTimer !== undefined)
        {
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = undefined;
        }
        return this.bot.close();
    }
}
