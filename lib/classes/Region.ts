import {Circuit} from './Circuit';
import {ObjectStore} from './ObjectStore';
import {Agent} from './Agent';
import {Caps} from './Caps';
import {Comms} from './Comms';
import {ClientEvents} from './ClientEvents';

export class Region
{
    xCoordinate: number;
    yCoordinate: number;
    circuit: Circuit;
    objects: ObjectStore;
    caps: Caps;
    comms: Comms;
    clientEvents: ClientEvents;

    constructor(agent: Agent, clientEvents: ClientEvents)
    {
        this.clientEvents = clientEvents;
        this.circuit = new Circuit(clientEvents);
        this.objects = new ObjectStore(this.circuit, agent, clientEvents);
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
