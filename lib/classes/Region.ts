import {Circuit} from './Circuit';
import {Agent} from './Agent';
import {Caps} from './Caps';
import {Comms} from './Comms';
import {ClientEvents} from './ClientEvents';
import {IObjectStore} from './interfaces/IObjectStore';
import {ObjectStoreFull} from './ObjectStoreFull';
import {BotOptionFlags} from '../enums/BotOptionFlags';
import {ObjectStoreLite} from './ObjectStoreLite';

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

    constructor(agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
    {
        this.options = options;
        this.clientEvents = clientEvents;
        this.circuit = new Circuit(clientEvents);
        if (options & BotOptionFlags.LiteObjectStore)
        {
            this.objects = new ObjectStoreLite(this.circuit, agent, clientEvents);
        }
        else
        {
            this.objects = new ObjectStoreFull(this.circuit, agent, clientEvents);
        }
        this.comms = new Comms(this.circuit, agent, clientEvents);
    }
    activateCaps(seedURL: string)
    {
        this.caps = new Caps(this, seedURL, this.clientEvents);
    }
    shutdown()
    {
        this.comms.shutdown();
        this.caps.shutdown();
        this.objects.shutdown();
        this.circuit.shutdown();

    }
}
