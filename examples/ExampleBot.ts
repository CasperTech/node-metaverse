import { Vector3 } from '../lib';
import { LoginResponse } from '../lib/classes/LoginResponse';
import { Bot } from '../lib/Bot';
import { LoginParameters } from '../lib/classes/LoginParameters';
import { BotOptionFlags } from '../lib/enums/BotOptionFlags';

import * as path from 'path';

import Signals = NodeJS.Signals;
import Timeout = NodeJS.Timeout;

export class ExampleBot
{
    protected masterAvatar = 'd1cd5b71-6209-4595-9bf0-771bf689ce00';
    protected isConnected = false;
    protected isConnecting = false;
    protected loginParamsJsonFile: string;
    protected loginResponse?: LoginResponse;
    protected bot: Bot;
    private reconnectTimer?: Timeout;
    protected loginParameters: LoginParameters;

    protected stayRegion?: string;
    protected stayPosition?: Vector3;
    protected firstName?: string;
    protected lastName?: string;

    constructor()
    {
        this.loginParamsJsonFile = path.join(__dirname, '..', '..', 'examples', 'loginParameters.json');
        this.loginParameters = require(this.loginParamsJsonFile);
        this.firstName = this.loginParameters.firstName;
        this.lastName = this.loginParameters.lastName;

        // If you don't intend to use the object store (i.e you have no interest in inworld objects, textures, etc,
        // using nmv.BotOptionFlags.LiteObjectStore will drastically reduce the footprint and CPU usage.
        //
        // The full object store has a full searchable rtree index, the lite does not.
        //
        // For the minimum footprint, use :
        //
        // const options = nmv.BotOptionFlags.LiteObjectStore | nmv.BotOptionFlags.StoreMyAttachmentsOnly;

        const options = BotOptionFlags.None;

        this.bot = new Bot(this.loginParameters, options);
    }

    public async run(): Promise<void>
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

        // This will tell the bot to keep trying to teleport back to the 'stay' location.
        // You can specify a region and position, such as:
        // bot.stayPut(true, 'Izanagi', new nmv.Vector3([128, 128, 21]));
        // Note that the 'stay' location will be updated if you request or accept a lure (a teleport).
        // If no region is specified, it will be set to the region you log in to.
        this.bot.stayPut(true, this.stayRegion, this.stayPosition);

        await this.login();
    }

    protected async onConnected(): Promise<void>
    {

    }

    protected async login(): Promise<void>
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

    private async reconnectCheck(): Promise<void>
    {
        if (!this.isConnected)
        {
            await this.login();
        }
    }

    private async connected(): Promise<void>
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

    // @ts-ignore
    private async close(): Promise<void>
    {
        if (this.reconnectTimer !== undefined)
        {
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = undefined;
        }
        return this.bot.close();
    }
}
