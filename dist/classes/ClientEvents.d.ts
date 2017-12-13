import { LureEvent } from '../events/LureEvent';
import { ChatEvent } from '../events/ChatEvent';
import { TeleportEvent } from '../events/TeleportEvent';
import { Subject } from 'rxjs/Subject';
export declare class ClientEvents {
    onNearbyChat: Subject<ChatEvent>;
    onLure: Subject<LureEvent>;
    onTeleportEvent: Subject<TeleportEvent>;
}
