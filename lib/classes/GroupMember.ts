import type { UUID } from './UUID';
import type * as Long from 'long';

export class GroupMember
{
    public AgentID: UUID;
    public OnlineStatus: string;
    public AgentPowers: Long;
    public Title: string;
    public IsOwner: boolean;
}
