import {UUID} from '..';

export class GroupChatEvent
{
    groupID: UUID;
    from: UUID;
    fromName: string;
    message: string;
}
