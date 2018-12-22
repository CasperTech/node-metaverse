import {UUID} from '..';

export class GroupProfileReplyEvent
{
    GroupID: UUID;
    Name: string;
    Charter: string;
    ShowInList: boolean;
    MemberTitle: string;
    PowersMask: Long;
    InsigniaID: UUID;
    FounderID: UUID;
    MembershipFee: number;
    OpenEnrollment: boolean;
    Money: number;
    GroupMembershipCount: number;
    GroupRolesCount: number;
    AllowPublish: boolean;
    MaturePublish: boolean;
    OwnerRole: UUID;
}
