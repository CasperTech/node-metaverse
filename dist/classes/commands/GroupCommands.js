"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const UUID_1 = require("../UUID");
const InstantMessageDialog_1 = require("../../enums/InstantMessageDialog");
const Utils_1 = require("../Utils");
const PacketFlags_1 = require("../../enums/PacketFlags");
const ImprovedInstantMessage_1 = require("../messages/ImprovedInstantMessage");
const Vector3_1 = require("../Vector3");
const InviteGroupRequest_1 = require("../messages/InviteGroupRequest");
const GroupRole_1 = require("../GroupRole");
const GroupRoleDataRequest_1 = require("../messages/GroupRoleDataRequest");
const Message_1 = require("../../enums/Message");
const GroupMember_1 = require("../GroupMember");
const FilterResponse_1 = require("../../enums/FilterResponse");
const LLSD = require("@caspertech/llsd");
class GroupCommands extends CommandsBase_1.CommandsBase {
    sendGroupNotice(groupID, subject, message) {
        if (typeof groupID === 'string') {
            groupID = new UUID_1.UUID(groupID);
        }
        const circuit = this.circuit;
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: groupID,
            ParentEstateID: 0,
            RegionID: UUID_1.UUID.zero(),
            Position: Vector3_1.Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog_1.InstantMessageDialog.GroupNotice,
            ID: UUID_1.UUID.zero(),
            Timestamp: 0,
            FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
            Message: Utils_1.Utils.StringToBuffer(subject + '|' + message),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags_1.PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }
    sendGroupInviteBulk(groupID, sendTo) {
        if (typeof groupID === 'string') {
            groupID = new UUID_1.UUID(groupID);
        }
        const igr = new InviteGroupRequest_1.InviteGroupRequestMessage();
        igr.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        igr.GroupData = {
            GroupID: groupID
        };
        igr.InviteData = [];
        sendTo.forEach((to) => {
            if (typeof to.avatarID === 'string') {
                to.avatarID = new UUID_1.UUID(to.avatarID);
            }
            if (to.roleID === undefined) {
                to.roleID = UUID_1.UUID.zero();
            }
            if (typeof to.roleID === 'string') {
                to.roleID = new UUID_1.UUID(to.roleID);
            }
            igr.InviteData.push({
                InviteeID: to.avatarID,
                RoleID: to.roleID
            });
        });
        const sequenceNo = this.circuit.sendMessage(igr, PacketFlags_1.PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }
    getSessionAgentCount(sessionID) {
        if (typeof sessionID === 'string') {
            sessionID = new UUID_1.UUID(sessionID);
        }
        return this.agent.getSessionAgentCount(sessionID);
    }
    sendGroupInvite(groupID, to, role) {
        const sendTo = [{
                avatarID: to,
                roleID: role
            }];
        return this.sendGroupInviteBulk(groupID, sendTo);
    }
    acceptGroupInvite(event) {
        const circuit = this.circuit;
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: event.from,
            ParentEstateID: 0,
            RegionID: UUID_1.UUID.zero(),
            Position: Vector3_1.Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog_1.InstantMessageDialog.GroupInvitationAccept,
            ID: event.inviteID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
            Message: Utils_1.Utils.StringToBuffer(''),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags_1.PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }
    rejectGroupInvite(event) {
        const circuit = this.circuit;
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: event.from,
            ParentEstateID: 0,
            RegionID: UUID_1.UUID.zero(),
            Position: Vector3_1.Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog_1.InstantMessageDialog.GroupInvitationDecline,
            ID: event.inviteID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
            Message: Utils_1.Utils.StringToBuffer(''),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags_1.PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }
    getMemberList(groupID) {
        return new Promise((resolve, reject) => {
            if (typeof groupID === 'string') {
                groupID = new UUID_1.UUID(groupID);
            }
            const result = [];
            const requestData = {
                'group_id': new LLSD.UUID(groupID.toString())
            };
            this.currentRegion.caps.capsRequestXML('GroupMemberData', requestData).then((response) => {
                if (response['members']) {
                    Object.keys(response['members']).forEach((uuid) => {
                        const member = new GroupMember_1.GroupMember();
                        const data = response['members'][uuid];
                        member.AgentID = new UUID_1.UUID(uuid);
                        member.OnlineStatus = data['last_login'];
                        let powers = response['defaults']['default_powers'];
                        if (data['powers']) {
                            powers = data['powers'];
                        }
                        member.IsOwner = data['owner'] === 'Y';
                        let titleIndex = 0;
                        if (data['title']) {
                            titleIndex = data['title'];
                        }
                        member.Title = response['titles'][titleIndex];
                        member.AgentPowers = Utils_1.Utils.HexToLong(powers);
                        result.push(member);
                    });
                    resolve(result);
                }
                else {
                    reject(new Error('Bad response'));
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
    getGroupRoles(groupID) {
        return new Promise((resolve, reject) => {
            const result = [];
            if (typeof groupID === 'string') {
                groupID = new UUID_1.UUID(groupID);
            }
            const grdr = new GroupRoleDataRequest_1.GroupRoleDataRequestMessage();
            grdr.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            const requestID = UUID_1.UUID.random();
            grdr.GroupData = {
                GroupID: groupID,
                RequestID: requestID
            };
            let totalRoleCount = 0;
            this.circuit.sendMessage(grdr, PacketFlags_1.PacketFlags.Reliable);
            this.circuit.waitForMessage(Message_1.Message.GroupRoleDataReply, 10000, (packet) => {
                const gmr = packet.message;
                if (gmr.GroupData.RequestID.toString() === requestID.toString()) {
                    totalRoleCount = gmr.GroupData.RoleCount;
                    gmr.RoleData.forEach((role) => {
                        const gr = new GroupRole_1.GroupRole();
                        gr.RoleID = role.RoleID;
                        gr.Name = Utils_1.Utils.BufferToStringSimple(role.Name);
                        gr.Title = Utils_1.Utils.BufferToStringSimple(role.Title);
                        gr.Description = Utils_1.Utils.BufferToStringSimple(role.Description);
                        gr.Powers = role.Powers;
                        gr.Members = role.Members;
                        result.push(gr);
                    });
                    if (totalRoleCount > result.length) {
                        return FilterResponse_1.FilterResponse.Match;
                    }
                    else {
                        return FilterResponse_1.FilterResponse.Finish;
                    }
                }
                else {
                    return FilterResponse_1.FilterResponse.NoMatch;
                }
            }).then(() => {
                resolve(result);
            }).catch((err) => {
                if (result.length === 0) {
                    reject(err);
                }
                else {
                    resolve(err);
                }
            });
        });
    }
}
exports.GroupCommands = GroupCommands;
//# sourceMappingURL=GroupCommands.js.map