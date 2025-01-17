import type { UUID } from '../classes/UUID';
import type * as Long from 'long';

export class GroupProfileReplyEvent
{
    public GroupID: UUID;
    public Name: string;
    public Charter: string;
    public ShowInList: boolean;
    public MemberTitle: string;
    public PowersMask: Long;
    public InsigniaID: UUID;
    public FounderID: UUID;
    public MembershipFee: number;
    public OpenEnrollment: boolean;
    public Money: number;
    public GroupMembershipCount: number;
    public GroupRolesCount: number;
    public AllowPublish: boolean;
    public MaturePublish: boolean;
    public OwnerRole: UUID;
}
