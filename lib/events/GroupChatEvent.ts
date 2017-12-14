import {UUID} from '../classes/UUID';

export class GroupChatEvent
{
    groupID: UUID;
    from: UUID;
    fromName: string;
    message: string;
}