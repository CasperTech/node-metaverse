import { ChatSourceType } from '../enums/ChatSourceType';
import { UUID } from '../classes/UUID';
import { InstantMessageEventFlags } from '../enums/InstantMessageEventFlags';
export declare class InstantMessageEvent {
    source: ChatSourceType;
    fromName: string;
    from: UUID;
    owner: UUID;
    message: string;
    flags: InstantMessageEventFlags;
}
