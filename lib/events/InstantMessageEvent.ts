import type { ChatSourceType } from '../enums/ChatSourceType';
import type { UUID } from '../classes/UUID';
import type { InstantMessageEventFlags } from '../enums/InstantMessageEventFlags';

export class InstantMessageEvent
{
    public source: ChatSourceType;
    public fromName: string;
    public from: UUID;
    public owner: UUID;
    public message: string;
    public flags: InstantMessageEventFlags;
}
