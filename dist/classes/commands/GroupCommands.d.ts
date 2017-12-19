import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import { GroupInviteEvent } from '../../events/GroupInviteEvent';
import { GroupRole } from '../GroupRole';
import { GroupMember } from '../GroupMember';
export declare class GroupCommands extends CommandsBase {
    sendGroupNotice(groupID: UUID | string, subject: string, message: string): Promise<void>;
    sendGroupInviteBulk(groupID: UUID | string, sendTo: {
        avatarID: UUID | string;
        roleID: UUID | string | undefined;
    }[]): Promise<void>;
    getSessionAgentCount(sessionID: UUID | string): number;
    sendGroupInvite(groupID: UUID | string, to: UUID | string, role: UUID | string | undefined): Promise<void>;
    acceptGroupInvite(event: GroupInviteEvent): Promise<void>;
    rejectGroupInvite(event: GroupInviteEvent): Promise<void>;
    getMemberList(groupID: UUID | string): Promise<GroupMember[]>;
    getGroupRoles(groupID: UUID | string): Promise<GroupRole[]>;
}
