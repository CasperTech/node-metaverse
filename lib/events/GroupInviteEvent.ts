import {UUID} from '..';

export class GroupInviteEvent
{
    from: UUID;
    fromName: string;
    message: string;
    inviteID: UUID;
}
