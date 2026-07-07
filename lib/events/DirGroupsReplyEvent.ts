import type { UUID } from '../classes/UUID';

export class DirGroupsReplyEvent
{
    public GroupID: UUID;
    public GroupName: string;
    public Members: number;
    public SearchOrder: number;
}
