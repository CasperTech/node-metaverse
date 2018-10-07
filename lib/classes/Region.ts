import {Circuit} from './Circuit';
import {Agent} from './Agent';
import {Caps} from './Caps';
import {Comms} from './Comms';
import {ClientEvents} from './ClientEvents';
import {IObjectStore} from './interfaces/IObjectStore';
import {ObjectStoreFull} from './ObjectStoreFull';
import {ObjectStoreLite} from './ObjectStoreLite';
import {BotOptionFlags} from '..';

export class Region
{
    xCoordinate: number;
    yCoordinate: number;
    circuit: Circuit;
    objects: IObjectStore;
    caps: Caps;
    comms: Comms;
    clientEvents: ClientEvents;
    options: BotOptionFlags;
    agent: Agent;

    constructor(agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
    {
        this.agent = agent;
        this.options = options;
        this.clientEvents = clientEvents;
        this.circuit = new Circuit(clientEvents);
        if (options & BotOptionFlags.LiteObjectStore)
        {
            this.objects = new ObjectStoreLite(this.circuit, agent, clientEvents, options);
        }
        else
        {
            this.objects = new ObjectStoreFull(this.circuit, agent, clientEvents, options);
        }
        this.comms = new Comms(this.circuit, agent, clientEvents);
    }
    activateCaps(seedURL: string)
    {
        this.caps = new Caps(this.agent, this, seedURL, this.clientEvents);
    }
    shutdown()
    {
        this.comms.shutdown();
        this.caps.shutdown();
        this.objects.shutdown();
        this.circuit.shutdown();

    }
}
