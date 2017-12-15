import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import {InstantMessageDialog} from '../../enums/InstantMessageDialog';
import {Utils} from '../Utils';
import {PacketFlags} from '../../enums/PacketFlags';
import {ImprovedInstantMessageMessage} from '../messages/ImprovedInstantMessage';
import {Vector3} from '../Vector3';
import {InviteGroupRequestMessage} from '../messages/InviteGroupRequest';
import {GroupInviteEvent} from '../../events/GroupInviteEvent';
import {GroupRole} from '../GroupRole';
import {GroupRoleDataRequestMessage} from '../messages/GroupRoleDataRequest';
import {Message} from '../../enums/Message';
import {Packet} from '../Packet';
import {GroupRoleDataReplyMessage} from '../messages/GroupRoleDataReply';
import {GroupMember} from '../GroupMember';
import {GroupMembersRequestMessage} from '../messages/GroupMembersRequest';
import {GroupMembersReplyMessage} from '../messages/GroupMembersReply';
import {FilterResponse} from '../../enums/FilterResponse';
import * as Long from 'long';
import {GroupChatSessionJoinEvent} from '../../events/GroupChatSessionJoinEvent';
import * as LLSD from 'llsd';

export class GroupCommands extends CommandsBase
{
    sendGroupNotice(groupID: UUID | string, subject: string, message: string)
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
        return circuit.waitForAck(sequenceNo, 10000);
    }

    sendGroupInviteBulk(groupID: UUID | string, sendTo: {
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
        sendTo.forEach((to) =>
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
        });

        const sequenceNo = this.circuit.sendMessage(igr, PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }

    sendGroupInvite(groupID: UUID | string, to: UUID | string, role: UUID | string | undefined): Promise<void>
    {
        const sendTo = [{
            avatarID: to,
            roleID: role
        }];
        return this.sendGroupInviteBulk(groupID, sendTo);
    }

    acceptGroupInvite(event: GroupInviteEvent): Promise<void>
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
        return circuit.waitForAck(sequenceNo, 10000);
    }

    rejectGroupInvite(event: GroupInviteEvent): Promise<void>
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
        return circuit.waitForAck(sequenceNo, 10000);
    }

    getMemberList(groupID: UUID | string): Promise<GroupMember[]>
    {
        return new Promise<GroupMember[]>((resolve, reject) =>
        {
            if (typeof groupID === 'string')
            {
                groupID = new UUID(groupID);
            }
            const result: GroupMember[] = [];
            const requestData = {
                'group_id': new LLSD.UUID(groupID.toString())
            };
            this.currentRegion.caps.capsRequestXML('GroupMemberData', requestData).then((response: any) =>
            {
                if (response['members'])
                {
                    Object.keys(response['members']).forEach((uuid) =>
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
                    });
                    resolve(result);
                }
                else
                {
                    reject(new Error('Bad response'));
                }
            }).catch((err) =>
            {
                reject(err);
            });
        });
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
            this.circuit.waitForMessage(Message.GroupRoleDataReply, 10000, (packet: Packet): FilterResponse =>
            {
                const gmr = packet.message as GroupRoleDataReplyMessage;
                if (gmr.GroupData.RequestID.toString() === requestID.toString())
                {
                    totalRoleCount = gmr.GroupData.RoleCount;
                    gmr.RoleData.forEach((role) =>
                    {
                        const gr = new GroupRole();
                        gr.RoleID = role.RoleID;
                        gr.Name = Utils.BufferToStringSimple(role.Name);
                        gr.Title = Utils.BufferToStringSimple(role.Title);
                        gr.Description = Utils.BufferToStringSimple(role.Description);
                        gr.Powers = role.Powers;
                        gr.Members = role.Members;
                        result.push(gr);
                    });
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
}
