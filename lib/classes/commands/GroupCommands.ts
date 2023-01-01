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
import { GroupRoleDataReplyMessage } from '../messages/GroupRoleDataReply';
import { GroupMember } from '../GroupMember';
import { FilterResponse } from '../../enums/FilterResponse';
import * as LLSD from '@caspertech/llsd';
import { EjectGroupMemberRequestMessage } from '../messages/EjectGroupMemberRequest';
import { GroupProfileRequestMessage } from '../messages/GroupProfileRequest';
import { GroupProfileReplyMessage } from '../messages/GroupProfileReply';
import { GroupBanAction } from '../../enums/GroupBanAction';
import { GroupBan } from '../GroupBan';
import { GroupInviteEvent } from '../../events/GroupInviteEvent';
import { GroupProfileReplyEvent } from '../../events/GroupProfileReplyEvent';

export class GroupCommands extends CommandsBase
{
    async sendGroupNotice(groupID: UUID | string, subject: string, message: string): Promise<void>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        const circuit = this.circuit;
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
        return await circuit.waitForAck(sequenceNo, 10000);
    }

    async sendGroupInviteBulk(groupID: UUID | string, sendTo: {
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
        return await this.circuit.waitForAck(sequenceNo, 10000);
    }

    getSessionAgentCount(sessionID: UUID | string): number
    {
        if (typeof sessionID === 'string')
        {
            sessionID = new UUID(sessionID);
        }
        return this.agent.getSessionAgentCount(sessionID);
    }

    async sendGroupInvite(groupID: UUID | string, to: UUID | string, role: UUID | string | undefined): Promise<void>
    {
        const sendTo = [{
            avatarID: to,
            roleID: role
        }];
        return await this.sendGroupInviteBulk(groupID, sendTo);
    }

    async acceptGroupInvite(event: GroupInviteEvent): Promise<void>
    {
        const circuit = this.circuit;
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
        return await circuit.waitForAck(sequenceNo, 10000);
    }

    async rejectGroupInvite(event: GroupInviteEvent): Promise<void>
    {
        const circuit = this.circuit;
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
        return await circuit.waitForAck(sequenceNo, 10000);
    }

    async unbanMembers(groupID: UUID | string, avatars: UUID | string | string[] | UUID[]): Promise<void>
    {
        return this.banMembers(groupID, avatars, GroupBanAction.Unban);
    }

    async banMembers(groupID: UUID | string, avatars: UUID | string | string[] | UUID[], groupAction: GroupBanAction = GroupBanAction.Ban): Promise<void>
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

        const requestData: any = {
            'ban_action': groupAction,
            'ban_ids': []
        };
        for (const id of listOfIDs)
        {
            requestData.ban_ids.push(new LLSD.UUID(id));
        }

        await this.currentRegion.caps.capsPostXML(['GroupAPIv1', { 'group_id': groupID.toString() }], requestData);
    }

    async getBanList(groupID: UUID | string): Promise<GroupBan[]>
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

    async getMemberList(groupID: UUID | string): Promise<GroupMember[]>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        const result: GroupMember[] = [];
        const requestData = {
            'group_id': new LLSD.UUID(groupID.toString())
        };

        const response: any = await this.currentRegion.caps.capsPostXML('GroupMemberData', requestData);
        if (response['members'])
        {
            for (const uuid of Object.keys(response['members']))
            {
                const member = new GroupMember();
                const data = response['members'][uuid];
                member.AgentID = new UUID(uuid);
                member.OnlineStatus = data['last_login'];
                let powers = response['defaults']['default_powers'];
                if (data['powers'])
                {
                    powers = data['powers'];
                }
                member.IsOwner = data['owner'] === 'Y';

                let titleIndex = 0;
                if (data['title'])
                {
                    titleIndex = data['title'];
                }
                member.Title = response['titles'][titleIndex];
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

    getGroupRoles(groupID: UUID | string): Promise<GroupRole[]>
    {
        return new Promise<GroupRole[]>((resolve, reject) =>
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
            this.circuit.waitForMessage<GroupRoleDataReplyMessage>(Message.GroupRoleDataReply, 10000, (gmr: GroupRoleDataReplyMessage): FilterResponse =>
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
            }).then(() =>
            {
                resolve(result);
            }).catch((err) =>
            {
                if (result.length === 0)
                {
                    reject(err);
                }
                else
                {
                    resolve(err);
                }
            });
        });
    }

    async ejectFromGroupBulk(groupID: UUID | string, sendTo: UUID[] | string[]): Promise<void>
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
        return await this.circuit.waitForAck(sequenceNo, 10000);
    }

    async ejectFromGroup(groupID: UUID | string, ejecteeID: UUID | string): Promise<void>
    {
        if (typeof ejecteeID === 'string')
        {
            ejecteeID = new UUID(ejecteeID);
        }

        const sendTo: UUID[] = [ejecteeID];

        return await this.ejectFromGroupBulk(groupID, sendTo);
    }

    async getGroupProfile(groupID: UUID | string): Promise<GroupProfileReplyEvent>
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
            const replyMessage: GroupProfileReplyMessage = packet as GroupProfileReplyMessage;
            if (replyMessage.GroupData.GroupID.equals(groupID))
            {
                // console.log('groupProfileReply Finish');
                return FilterResponse.Finish;
            }
            // console.log('groupProfileReply NoMatch');
            return FilterResponse.NoMatch;
        })) as GroupProfileReplyMessage;

        return new class implements GroupProfileReplyEvent
        {
            GroupID = groupProfileReply.GroupData.GroupID;
            Name = Utils.BufferToStringSimple(groupProfileReply.GroupData.Name);
            Charter =  Utils.BufferToStringSimple(groupProfileReply.GroupData.Charter);
            ShowInList = groupProfileReply.GroupData.ShowInList;
            MemberTitle = Utils.BufferToStringSimple(groupProfileReply.GroupData.MemberTitle);
            PowersMask = groupProfileReply.GroupData.PowersMask;
            InsigniaID = groupProfileReply.GroupData.InsigniaID;
            FounderID = groupProfileReply.GroupData.FounderID;
            MembershipFee = groupProfileReply.GroupData.MembershipFee;
            OpenEnrollment = groupProfileReply.GroupData.OpenEnrollment;
            Money = groupProfileReply.GroupData.Money;
            GroupMembershipCount = groupProfileReply.GroupData.GroupMembershipCount;
            GroupRolesCount = groupProfileReply.GroupData.GroupRolesCount;
            AllowPublish = groupProfileReply.GroupData.AllowPublish;
            MaturePublish = groupProfileReply.GroupData.MaturePublish;
            OwnerRole = groupProfileReply.GroupData.OwnerRole;
        };
    }
}
