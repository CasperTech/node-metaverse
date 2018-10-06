import {ChatSourceType, InstantMessageEventFlags, UUID} from '..';

export class InstantMessageEvent
{
    source: ChatSourceType;
    fromName: string;
    from: UUID;
    owner: UUID;
    message: string;
    flags: InstantMessageEventFlags;
}
