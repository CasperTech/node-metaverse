import { LoginResponse } from './classes/LoginResponse';
import { LoginParameters } from './classes/LoginParameters';
import { Region } from './classes/Region';
import { ClientEvents } from './classes/ClientEvents';
import { ClientCommands } from './classes/ClientCommands';
import { BotOptionFlags } from './enums/BotOptionFlags';
export declare class Bot {
    private loginParams;
    private currentRegion;
    private agent;
    private ping;
    private pingNumber;
    private lastSuccessfulPing;
    private circuitSubscription;
    private options;
    clientEvents: ClientEvents;
    clientCommands: ClientCommands;
    constructor(login: LoginParameters, options: BotOptionFlags);
    login(): Promise<LoginResponse>;
    changeRegion(region: Region): Promise<void>;
    private closeCircuit;
    private kicked;
    private disconnected;
    close(): Promise<void>;
    connectToSim(): Promise<void>;
}
