import {UUID} from './UUID';

export class Circuit
{
    secureSessionID: UUID;
    sessionID: UUID;
    circuitCode: number;
    udpBlacklist: string[];
    timestamp: number;
    seedCapability: string;
}
