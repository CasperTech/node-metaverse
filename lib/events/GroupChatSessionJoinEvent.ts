import type { UUID } from '../classes/UUID';

export class GroupChatSessionJoinEvent
{
    public sessionID: UUID;
    public success: boolean;
}
