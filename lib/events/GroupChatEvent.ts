import type { UUID } from '../classes/UUID';

export class GroupChatEvent
{
    public groupID: UUID;
    public from: UUID;
    public fromName: string;
    public message: string;
}
