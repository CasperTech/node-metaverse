import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import {Utils} from '../Utils';
import {PacketFlags} from '../../enums/PacketFlags';
import {ImprovedInstantMessageMessage} from '../messages/ImprovedInstantMessage';
import {Vector3} from '../Vector3';
import {ChatFromViewerMessage} from '../messages/ChatFromViewer';
import {ChatType} from '../../enums/ChatType';
import {InstantMessageDialog} from '../../enums/InstantMessageDialog';
import Timer = NodeJS.Timer;
import {GroupInviteEvent} from '../../events/GroupInviteEvent';

export class CommunicationsCommands extends CommandsBase
{
    sendInstantMessage(to: UUID | string, message: string): Promise<void>
    {
        const circuit = this.circuit;
        if (typeof to === 'string')
        {
            to = new UUID(to);
        }
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: to,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 1,
            Dialog: 0,
            ID: UUID.zero(),
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(message),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }

    nearbyChat(message: string, type: ChatType, channel?: number): Promise<void>
    {
        if (channel === undefined)
        {
            channel = 0;
        }
        const cfv = new ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Utils.StringToBuffer(message),
            Type: type,
            Channel: channel
        };
        const sequenceNo = this.circuit.sendMessage(cfv, PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }

    say(message: string, channel?: number): Promise<void>
    {
        return this.nearbyChat(message, ChatType.Normal, channel);
    }

    whisper(message: string, channel?: number): Promise<void>
    {
        return this.nearbyChat(message, ChatType.Whisper, channel);
    }

    shout(message: string, channel?: number): Promise<void>
    {
        return this.nearbyChat(message, ChatType.Shout, channel);
    }

    startTypingLocal(): Promise<void>
    {
        const cfv = new ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Buffer.allocUnsafe(0),
            Type: ChatType.StartTyping,
            Channel: 0
        };
        const sequenceNo = this.circuit.sendMessage(cfv, PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }

    stopTypingLocal(): Promise<void>
    {
        const cfv = new ChatFromViewerMessage();
        cfv.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        cfv.ChatData = {
            Message: Buffer.allocUnsafe(0),
            Type: ChatType.StopTyping,
            Channel: 0
        };
        const sequenceNo = this.circuit.sendMessage(cfv, PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }

    startTypingIM(to: UUID | string): Promise<void>
    {
        if (typeof to === 'string')
        {
            to = new UUID(to);
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
            ToAgentID: to,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog.StartTyping,
            ID: UUID.zero(),
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

    stopTypingIM(to: UUID | string): Promise<void>
    {
        if (typeof to === 'string')
        {
            to = new UUID(to);
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
            ToAgentID: to,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog.StopTyping,
            ID: UUID.zero(),
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

    typeInstantMessage(to: UUID | string, message: string, thinkingTime?: number, charactersPerSecond?: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (thinkingTime === undefined)
            {
                thinkingTime = 2000;
            }
            setTimeout(() =>
            {
                if (typeof to === 'string')
                {
                    to = new UUID(to);
                }
                let typeTimer: Timer | null = null;
                this.startTypingIM(to).then(() =>
                {
                    typeTimer = setInterval(() =>
                    {
                        this.startTypingIM(to).catch(() =>
                        {
                            // ignore
                        });
                    }, 5000);
                    if (charactersPerSecond === undefined)
                    {
                        charactersPerSecond = 5;
                    }

                    const timeToWait = (message.length / charactersPerSecond) * 1000;
                    setTimeout(() =>
                    {
                        if (typeTimer !== null)
                        {
                            clearInterval(typeTimer);
                            typeTimer = null;
                        }
                        this.stopTypingIM(to).then(() =>
                        {
                            this.sendInstantMessage(to, message).then(() =>
                            {
                                resolve();
                            }).catch((err) =>
                            {
                                reject(err);
                            });
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                    }, timeToWait);
                }).catch((err) =>
                {
                    if (typeTimer !== null)
                    {
                        clearInterval(typeTimer);
                        typeTimer = null;
                    }
                    reject(err);
                });
            }, thinkingTime);
        });
    }

    sendGroupMessage(groupID: UUID | string, message: string): Promise<void>
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
            Dialog: InstantMessageDialog.SessionSend,
            ID: groupID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(message),
            BinaryBucket: Utils.StringToBuffer('')
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }

    typeLocalMessage(message: string, thinkingTime?: number, charactersPerSecond?: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (thinkingTime === undefined)
            {
                thinkingTime = 0;
            }
            setTimeout(() =>
            {
                this.startTypingLocal().then(() =>
                {
                    this.bot.clientCommands.agent.startAnimations([new UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]).then(() =>
                    {
                        if (charactersPerSecond === undefined)
                        {
                            charactersPerSecond = 5;
                        }

                        const timeToWait = (message.length / charactersPerSecond) * 1000;
                        setTimeout(() =>
                        {
                            this.stopTypingLocal().then(() =>
                            {
                                this.bot.clientCommands.agent.stopAnimations([new UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]).then(() =>
                                {
                                    this.say(message).then(() =>
                                    {
                                        resolve();
                                    }).catch((err) =>
                                    {
                                        reject(err);
                                    });
                                }).catch((err) => {
                                    reject(err);
                                });
                            }).catch((err) => {
                                reject(err);
                            });
                        }, timeToWait);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }, thinkingTime);
        });
    }
}
