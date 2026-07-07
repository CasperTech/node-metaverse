import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import { InstantMessageDialog } from '../../enums/InstantMessageDialog';
import { Utils } from '../Utils';
import { PacketFlags } from '../../enums/PacketFlags';
import { ImprovedInstantMessageMessage } from '../messages/ImprovedInstantMessage';
import { Vector3 } from '../Vector3';
import { InviteGroupRequestMessage } from '../messages/InviteGroupRequest';
import { GroupRole } from '../GroupRole';
import { GroupRoleDataRequestMessage } from '../messages/GroupRoleDataRequest';
import { Message } from '../../enums/Message';
import type { GroupRoleDataReplyMessage } from '../messages/GroupRoleDataReply';
import { GroupMember } from '../GroupMember';
import { FilterResponse } from '../../enums/FilterResponse';
import * as LLSD from '@caspertech/llsd';
import { EjectGroupMemberRequestMessage } from '../messages/EjectGroupMemberRequest';
import { GroupProfileRequestMessage } from '../messages/GroupProfileRequest';
import type { GroupProfileReplyMessage } from '../messages/GroupProfileReply';
import { GroupBanAction } from '../../enums/GroupBanAction';
import { GroupBan } from '../GroupBan';
import type { GroupInviteEvent } from '../../events/GroupInviteEvent';
import type { GroupProfileReplyEvent } from '../../events/GroupProfileReplyEvent';
import { DirFindQueryMessage } from '../messages/DirFindQuery';
import type { DirGroupsReplyMessage } from '../messages/DirGroupsReply';
import { DirFindFlags } from '../../enums/DirFindFlags';
import { DirGroupsReplyEvent } from '../../events/DirGroupsReplyEvent';
import { GroupRoleMembersRequestMessage } from '../messages/GroupRoleMembersRequest';
import type { GroupRoleMembersReplyMessage } from '../messages/GroupRoleMembersReply';
import { GroupRoleMember } from '../GroupRoleMember';
import { JoinGroupRequestMessage } from '../messages/JoinGroupRequest';
import type { JoinGroupReplyMessage } from '../messages/JoinGroupReply';
import { LeaveGroupRequestMessage } from '../messages/LeaveGroupRequest';
import type { LeaveGroupReplyMessage } from '../messages/LeaveGroupReply';

export class GroupCommands extends CommandsBase
{
    public async sendGroupNotice(groupID: UUID | string, subject: string, message: string): Promise<void>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        const {circuit} = this;
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: groupID,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog.GroupNotice,
            ID: UUID.zero(),
            Timestamp: 0,
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(subject + '|' + message),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        await circuit.waitForAck(sequenceNo, 10000);
    }

    public async sendGroupInviteBulk(groupID: UUID | string, sendTo: {
        avatarID: UUID | string,
        roleID: UUID | string | undefined
    }[]): Promise<void>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        const igr = new InviteGroupRequestMessage();
        igr.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        igr.GroupData = {
            GroupID: groupID
        };
        igr.InviteData = [];
        for (const to of sendTo)
        {
            if (typeof to.avatarID === 'string')
            {
                to.avatarID = new UUID(to.avatarID);
            }
            if (to.roleID === undefined)
            {
                to.roleID = UUID.zero();
            }
            if (typeof to.roleID === 'string')
            {
                to.roleID = new UUID(to.roleID);
            }
            igr.InviteData.push({
                InviteeID: to.avatarID,
                RoleID: to.roleID
            });
        }

        const sequenceNo = this.circuit.sendMessage(igr, PacketFlags.Reliable);
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public getSessionAgentCount(sessionID: UUID | string): number
    {
        if (typeof sessionID === 'string')
        {
            sessionID = new UUID(sessionID);
        }
        return this.agent.getSessionAgentCount(sessionID);
    }

    public async sendGroupInvite(groupID: UUID | string, to: UUID | string, role: UUID | string | undefined): Promise<void>
    {
        const sendTo = [{
            avatarID: to,
            roleID: role
        }];
        await this.sendGroupInviteBulk(groupID, sendTo);
    }

    public async acceptGroupInvite(event: GroupInviteEvent): Promise<void>
    {
        const {circuit} = this;
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: event.from,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog.GroupInvitationAccept,
            ID: event.inviteID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(''),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        await circuit.waitForAck(sequenceNo, 10000);
    }

    public async rejectGroupInvite(event: GroupInviteEvent): Promise<void>
    {
        const {circuit} = this;
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: event.from,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog.GroupInvitationDecline,
            ID: event.inviteID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(''),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        await circuit.waitForAck(sequenceNo, 10000);
    }

    public async unbanMembers(groupID: UUID | string, avatars: UUID | string | string[] | UUID[]): Promise<void>
    {
        return this.banMembers(groupID, avatars, GroupBanAction.Unban);
    }

    public async banMembers(groupID: UUID | string, avatars: UUID | string | string[] | UUID[], groupAction: GroupBanAction = GroupBanAction.Ban): Promise<void>
    {
        const listOfIDs: string[] = [];
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        if (Array.isArray(avatars))
        {
            for (const av of avatars)
            {
                if (typeof av === 'string')
                {
                    listOfIDs.push(av);
                }
                else
                {
                    listOfIDs.push(av.toString());
                }
            }
        }
        else if (typeof avatars === 'string')
        {
            listOfIDs.push(avatars);
        }
        else
        {
            listOfIDs.push(avatars.toString());
        }

        const requestData: {
            ban_action: GroupBanAction,
            ban_ids: unknown[]
        } = {
            'ban_action': groupAction,
            'ban_ids': []
        };
        for (const id of listOfIDs)
        {
            requestData.ban_ids.push(new LLSD.UUID(id));
        }

        await this.currentRegion.caps.capsPostXML(['GroupAPIv1', { 'group_id': groupID.toString() }], requestData);
    }

    public async getBanList(groupID: UUID | string): Promise<GroupBan[]>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        const result = await this.currentRegion.caps.capsGetXML(['GroupAPIv1', { 'group_id': groupID.toString() }]);
        const bans: GroupBan[] = [];
        if (result.ban_list !== undefined)
        {
            for (const k of Object.keys(result.ban_list))
            {
                bans.push(new GroupBan(new UUID(k), result.ban_list[k].ban_date));
            }
        }
        return bans;
    }

    public async getMemberList(groupID: UUID | string): Promise<GroupMember[]>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        const result: GroupMember[] = [];
        const requestData = {
            'group_id': new LLSD.UUID(groupID.toString())
        };

        const response = await this.currentRegion.caps.capsPostXML('GroupMemberData', requestData) as {
            members?: Record<string, {
                last_login: string,
                owner: string,
                title: number,
                powers: string,
            }>,
            titles: Record<string, string>,
            defaults: {
                default_powers: string
            }
        };
        if (response.members !== undefined)
        {
            for (const uuid of Object.keys(response.members))
            {
                const member = new GroupMember();
                const data = response.members[uuid];
                member.AgentID = new UUID(uuid);
                member.OnlineStatus = data.last_login;
                let powers = response.defaults.default_powers;
                if (data.powers)
                {
                    powers = data.powers;
                }
                member.IsOwner = data.owner === 'Y';

                let titleIndex = 0;
                if (data.title)
                {
                    titleIndex = data.title;
                }
                member.Title = response.titles[titleIndex];
                member.AgentPowers = Utils.HexToLong(powers);

                result.push(member);
            }
            return result;
        }
        else
        {
            throw new Error('Bad response');
        }
    }

    public async getGroupRoles(groupID: UUID | string): Promise<GroupRole[]>
    {
        const result: GroupRole[] = [];
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        const grdr = new GroupRoleDataRequestMessage();
        grdr.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        const requestID = UUID.random();
        grdr.GroupData = {
            GroupID: groupID,
            RequestID: requestID
        };
        let totalRoleCount = 0;

        this.circuit.sendMessage(grdr, PacketFlags.Reliable);
        await this.circuit.waitForMessage<GroupRoleDataReplyMessage>(Message.GroupRoleDataReply, 10000, (gmr: GroupRoleDataReplyMessage): FilterResponse =>
        {
            if (gmr.GroupData.RequestID.toString() === requestID.toString())
            {
                totalRoleCount = gmr.GroupData.RoleCount;
                for (const role of gmr.RoleData)
                {
                    const gr = new GroupRole();
                    gr.RoleID = role.RoleID;
                    gr.Name = Utils.BufferToStringSimple(role.Name);
                    gr.Title = Utils.BufferToStringSimple(role.Title);
                    gr.Description = Utils.BufferToStringSimple(role.Description);
                    gr.Powers = role.Powers;
                    gr.Members = role.Members;
                    result.push(gr);
                }
                if (totalRoleCount > result.length)
                {
                    return FilterResponse.Match;
                }
                else
                {
                    return FilterResponse.Finish;
                }
            }
            else
            {
                return FilterResponse.NoMatch;
            }
        });
        return result;
    }

    public async ejectFromGroupBulk(groupID: UUID | string, sendTo: UUID[] | string[]): Promise<void>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }

        const msg: EjectGroupMemberRequestMessage = new EjectGroupMemberRequestMessage();

        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.GroupData = {
            GroupID: groupID
        };
        msg.EjectData = [];

        for (let ejecteeID of sendTo)
        {
            if (typeof ejecteeID === 'string')
            {
                ejecteeID = new UUID(ejecteeID);
            }
            msg.EjectData.push({
                EjecteeID: ejecteeID
            });
        };

        const sequenceNo = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async ejectFromGroup(groupID: UUID | string, ejecteeID: UUID | string): Promise<void>
    {
        if (typeof ejecteeID === 'string')
        {
            ejecteeID = new UUID(ejecteeID);
        }

        const sendTo: UUID[] = [ejecteeID];

        await this.ejectFromGroupBulk(groupID, sendTo);
    }

    public async getGroupProfile(groupID: UUID | string): Promise<GroupProfileReplyEvent>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }

        const msg: GroupProfileRequestMessage = new GroupProfileRequestMessage();

        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.GroupData = {
            GroupID: groupID
        };

        this.circuit.sendMessage(msg, PacketFlags.Reliable);

        const groupProfileReply: GroupProfileReplyMessage = (await this.circuit.waitForMessage(Message.GroupProfileReply, 10000, (packet: GroupProfileReplyMessage): FilterResponse =>
        {
            const replyMessage: GroupProfileReplyMessage = packet;
            if (replyMessage.GroupData.GroupID.equals(groupID))
            {
                console.log('groupProfileReply Finish');
                return FilterResponse.Finish;
            }
            console.log('groupProfileReply NoMatch');
            return FilterResponse.NoMatch;
        }));

        return new class implements GroupProfileReplyEvent
        {
            public GroupID = groupProfileReply.GroupData.GroupID;
            public Name = Utils.BufferToStringSimple(groupProfileReply.GroupData.Name);
            public Charter =  Utils.BufferToStringSimple(groupProfileReply.GroupData.Charter);
            public ShowInList = groupProfileReply.GroupData.ShowInList;
            public MemberTitle = Utils.BufferToStringSimple(groupProfileReply.GroupData.MemberTitle);
            public PowersMask = groupProfileReply.GroupData.PowersMask;
            public InsigniaID = groupProfileReply.GroupData.InsigniaID;
            public FounderID = groupProfileReply.GroupData.FounderID;
            public MembershipFee = groupProfileReply.GroupData.MembershipFee;
            public OpenEnrollment = groupProfileReply.GroupData.OpenEnrollment;
            public Money = groupProfileReply.GroupData.Money;
            public GroupMembershipCount = groupProfileReply.GroupData.GroupMembershipCount;
            public GroupRolesCount = groupProfileReply.GroupData.GroupRolesCount;
            public AllowPublish = groupProfileReply.GroupData.AllowPublish;
            public MaturePublish = groupProfileReply.GroupData.MaturePublish;
            public OwnerRole = groupProfileReply.GroupData.OwnerRole;
        };
    }

    public async searchGroups(query: string, start = 0): Promise<DirGroupsReplyEvent[]>
    {
        const msg = new DirFindQueryMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        const queryID = UUID.random();
        msg.QueryData = {
            QueryID: queryID,
            QueryText: Utils.StringToBuffer(query),
            QueryFlags: DirFindFlags.Groups | DirFindFlags.IncludePG | DirFindFlags.IncludeMature | DirFindFlags.IncludeAdult,
            QueryStart: start
        };

        this.circuit.sendMessage(msg, PacketFlags.Reliable);

        const reply = await this.circuit.waitForMessage<DirGroupsReplyMessage>(Message.DirGroupsReply, 10000, (dgr: DirGroupsReplyMessage): FilterResponse =>
        {
            if (dgr.QueryData.QueryID.equals(queryID))
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });

        const results: DirGroupsReplyEvent[] = [];
        for (const group of reply.QueryReplies ?? [])
        {
            if (group.GroupID.isZero())
            {
                continue;
            }
            const result = new DirGroupsReplyEvent();
            result.GroupID = group.GroupID;
            result.GroupName = Utils.BufferToStringSimple(group.GroupName);
            result.Members = group.Members;
            result.SearchOrder = group.SearchOrder;
            results.push(result);
        }
        return results;
    }

    public async getRoleMembers(groupID: UUID | string): Promise<GroupRoleMember[]>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }

        const msg = new GroupRoleMembersRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        const requestID = UUID.random();
        msg.GroupData = {
            GroupID: groupID,
            RequestID: requestID
        };

        this.circuit.sendMessage(msg, PacketFlags.Reliable);

        const result: GroupRoleMember[] = [];
        let totalPairs = 0;
        let receivedPairs = 0;
        await this.circuit.waitForMessage<GroupRoleMembersReplyMessage>(Message.GroupRoleMembersReply, 10000, (grmr: GroupRoleMembersReplyMessage): FilterResponse =>
        {
            if (!grmr.AgentData.RequestID.equals(requestID))
            {
                return FilterResponse.NoMatch;
            }
            totalPairs = grmr.AgentData.TotalPairs;
            for (const pair of grmr.MemberData ?? [])
            {
                receivedPairs++;
                if (pair.RoleID.isZero() && pair.MemberID.isZero())
                {
                    continue;
                }
                const member = new GroupRoleMember();
                member.RoleID = pair.RoleID;
                member.MemberID = pair.MemberID;
                result.push(member);
            }
            if (totalPairs === 0 || receivedPairs >= totalPairs)
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.Match;
        });
        return result;
    }

    public async getMemberRoles(groupID: UUID | string, memberID: UUID | string): Promise<UUID[]>
    {
        if (typeof memberID === 'string')
        {
            memberID = new UUID(memberID);
        }
        const pairs = await this.getRoleMembers(groupID);
        const roles: UUID[] = [];
        for (const pair of pairs)
        {
            if (pair.MemberID.equals(memberID))
            {
                roles.push(pair.RoleID);
            }
        }
        return roles;
    }

    public async joinGroup(groupID: UUID | string, approveCost?: (cost: number) => boolean | Promise<boolean>): Promise<boolean>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }

        const profile = await this.getGroupProfile(groupID);
        const membershipFee = profile.MembershipFee;
        if (membershipFee > 0)
        {
            if (approveCost === undefined)
            {
                throw new Error('Refusing to join group ' + groupID.toString() + ': it charges a membership fee of L$' + membershipFee + ' and no cost-approval callback was provided to joinGroup().');
            }
            if (!(await approveCost(membershipFee)))
            {
                return false;
            }
        }

        const msg = new JoinGroupRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.GroupData = {
            GroupID: groupID
        };

        this.circuit.sendMessage(msg, PacketFlags.Reliable);

        const reply = await this.circuit.waitForMessage<JoinGroupReplyMessage>(Message.JoinGroupReply, 10000, (jgr: JoinGroupReplyMessage): FilterResponse =>
        {
            if ((groupID as UUID).equals(jgr.GroupData.GroupID))
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });

        return reply.GroupData.Success;
    }

    public async leaveGroup(groupID: UUID | string): Promise<boolean>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }

        const msg = new LeaveGroupRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.GroupData = {
            GroupID: groupID
        };

        this.circuit.sendMessage(msg, PacketFlags.Reliable);

        const reply = await this.circuit.waitForMessage<LeaveGroupReplyMessage>(Message.LeaveGroupReply, 10000, (lgr: LeaveGroupReplyMessage): FilterResponse =>
        {
            if ((groupID as UUID).equals(lgr.GroupData.GroupID))
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });

        return reply.GroupData.Success;
    }
}
