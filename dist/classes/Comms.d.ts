import { Circuit } from './Circuit';
import { Agent } from './Agent';
import { ChatType } from '../enums/ChatType';
import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
export declare class Comms {
    private circuit;
    private agent;
    private clientEvents;
    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents);
    nearbyChat(message: string, type: ChatType, channel?: number): void;
    say(message: string, channel?: number): void;
    whisper(message: string, channel?: number): void;
    shout(message: string, channel?: number): void;
    startTypingLocal(): void;
    stopTypingLocal(): void;
    typeMessage(message: string): void;
    shutdown(): void;
    sendInstantMessage(to: UUID | string, message: string): Promise<void>;
}
