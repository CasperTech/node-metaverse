import { TeleportEventType } from '../enums/TeleportEventType';
export declare class TeleportEvent {
    eventType: TeleportEventType;
    message: string;
    simIP: string;
    simPort: number;
    seedCapability: string;
}
