import { UUID } from '../classes/UUID';

export class GroupInviteEvent
{
    from: UUID;
    fromName: string;
    message: string;
    inviteID: UUID;
}
