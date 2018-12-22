import {UUID} from '..';

export class GroupNoticeEvent
{
    groupID: UUID;
    from: UUID;
    fromName: string;
    message: string;
}
