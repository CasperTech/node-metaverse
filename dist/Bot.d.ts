import { LoginParameters } from './classes/LoginParameters';
import { Region } from './classes/Region';
import { ClientEvents } from './classes/ClientEvents';
import { ClientCommands } from './classes/ClientCommands';
export declare class Bot {
    private loginParams;
    private currentRegion;
    private agent;
    private ping;
    private pingNumber;
    private lastSuccessfulPing;
    private circuitSubscription;
    clientEvents: ClientEvents;
    clientCommands: ClientCommands;
    constructor(login: LoginParameters);
    login(): Promise<{}>;
    changeRegion(region: Region): Promise<{}>;
    close(): Promise<{}>;
    connectToSim(): Promise<{}>;
}
