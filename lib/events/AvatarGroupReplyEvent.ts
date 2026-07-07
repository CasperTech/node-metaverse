import type { UUID } from '../classes/UUID';
import type * as Long from 'long';

export class AvatarGroupReplyEvent
{
    public GroupID: UUID;
    public GroupName: string;
    public GroupTitle: string;
    public GroupPowers: Long;
    public GroupInsigniaID: UUID;
    public AcceptNotices: boolean;
    public ListInProfile: boolean;
}
