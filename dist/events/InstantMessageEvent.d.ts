import { ChatSourceType, InstantMessageEventFlags, UUID } from '..';
export declare class InstantMessageEvent {
    source: ChatSourceType;
    fromName: string;
    from: UUID;
    owner: UUID;
    message: string;
    flags: InstantMessageEventFlags;
}
