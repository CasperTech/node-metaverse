import {UUID} from './UUID';
import {MessageDecoder} from './MessageDecoder';

export class Circuit
{
    secureSessionID: UUID;
    sessionID: UUID;
    circuitCode: number;
    udpBlacklist: string[];
    timestamp: number;
    seedCapability: string;
    decoder: MessageDecoder;

    constructor()
    {
        this.decoder = new MessageDecoder();
    }
}
