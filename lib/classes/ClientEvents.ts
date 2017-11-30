import {LureEvent} from '../events/LureEvent';
import {ChatEvent} from '../events/ChatEvent';
import {TeleportEvent} from '../events/TeleportEvent';
import {Subject} from 'rxjs/Subject';

export class ClientEvents
{
    onNearbyChat: Subject<ChatEvent> = new Subject<ChatEvent>();
    onLure: Subject<LureEvent> = new Subject<LureEvent>();
    onTeleportEvent: Subject<TeleportEvent> = new Subject<TeleportEvent>();
}
