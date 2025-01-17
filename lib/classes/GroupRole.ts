import type { UUID } from './UUID';
import type * as Long from 'long';

export class GroupRole
{
    public RoleID: UUID;
    public Name: string;
    public Title: string;
    public Description: string;
    public Powers: Long;
    public Members: number;
}
