import type { UUID } from '../classes/UUID';

export class GroupNoticeEvent
{
    public groupID: UUID;
    public from: UUID;
    public fromName: string;
    public subject: string;
    public message: string;
}
