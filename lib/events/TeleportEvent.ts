import {TeleportEventType} from '../enums/TeleportEventType';

export class TeleportEvent
{
    eventType: TeleportEventType;
    message: string;
    simIP: string;
    simPort: number;
    seedCapability: string;
}
