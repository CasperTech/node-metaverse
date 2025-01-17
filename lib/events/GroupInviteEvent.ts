import type { UUID } from '../classes/UUID';

export class GroupInviteEvent
{
    public from: UUID;
    public fromName: string;
    public message: string;
    public inviteID: UUID;
}
