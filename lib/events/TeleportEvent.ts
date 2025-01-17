import type { TeleportEventType } from '../enums/TeleportEventType';

export class TeleportEvent
{
    public eventType: TeleportEventType;
    public message: string;
    public simIP: string;
    public simPort: number;
    public seedCapability: string;
}
