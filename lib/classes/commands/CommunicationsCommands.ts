import * as LLSD from '@caspertech/llsd';
import { AssetType } from '../../enums/AssetType';
import { ChatType } from '../../enums/ChatType';
import { FilterResponse } from '../../enums/FilterResponse';
import { InstantMessageDialog } from '../../enums/InstantMessageDialog';
import { InstantMessageOnline } from '../../enums/InstantMessageOnline';
import { PacketFlags } from '../../enums/PacketFlags';
import type { GroupChatSessionJoinEvent } from '../../events/GroupChatSessionJoinEvent';
import type { ScriptDialogEvent } from '../../events/ScriptDialogEvent';
import type { InventoryFolder } from '../InventoryFolder';
import { InventoryItem } from '../InventoryItem';
import { ChatFromViewerMessage } from '../messages/ChatFromViewer';
import { ImprovedInstantMessageMessage } from '../messages/ImprovedInstantMessage';
import { ScriptDialogReplyMessage } from '../messages/ScriptDialogReply';
import { StartLureMessage } from '../messages/StartLure';
import { Utils } from '../Utils';
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { CommandsBase } from './CommandsBase';

export class CommunicationsCommands extends CommandsBase
{
    public async giveInventory(to: UUID | string, itemOrFolder: InventoryItem | InventoryFolder): Promise<void>
    {
        const {circuit} = this;
        if (typeof to === 'string')
        {
            to = new UUID(to);
        }
        let bucket: Buffer | undefined = undefined;
        if (itemOrFolder instanceof InventoryItem)
        {
            bucket = Buffer.allocUnsafe(17);
            bucket.writeUInt8(itemOrFolder.type, 0);
            itemOrFolder.itemID.writeToBuffer(bucket, 1);
        }
        else
        {
            await itemOrFolder.populate(false);
            bucket = Buffer.allocUnsafe(17 * (itemOrFolder.items.length + 1));
            let offset = 0;
            bucket.writeUInt8(AssetType.Category, offset++);
            itemOrFolder.folderID.writeToBuffer(bucket, offset); offset += 16;
            for (const item of itemOrFolder.items)
            {
                bucket.writeUInt8(item.type, offset++);
                item.itemID.writeToBuffer(bucket, offset); offset += 16;
            }
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
            Offline: InstantMessageOnline.Online,
            Dialog: InstantMessageDialog.InventoryOffered,
            ID: UUID.random(),
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(itemOrFolder.name),
            BinaryBucket: bucket
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        await circuit.waitForAck(sequenceNo, 10000);
    }

    public async sendInstantMessage(to: UUID | string, message: string): Promise<void>
    {
        const {circuit} = this;
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
        await circuit.waitForAck(sequenceNo, 10000);
    }

    public async nearbyChat(message: string, type: ChatType, channel?: number): Promise<void>
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
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async say(message: string, channel?: number): Promise<void>
    {
        await this.nearbyChat(message, ChatType.Normal, channel);
    }

    public async whisper(message: string, channel?: number): Promise<void>
    {
        await this.nearbyChat(message, ChatType.Whisper, channel);
    }

    public async shout(message: string, channel?: number): Promise<void>
    {
        await this.nearbyChat(message, ChatType.Shout, channel);
    }

    public async startTypingLocal(): Promise<void>
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
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async sendTeleport(target: UUID | string, message?: string): Promise<void>
    {
        if (typeof target === 'string')
        {
            target = new UUID(target);
        }
        if (message === undefined)
        {
            message = 'Join me in ' + this.currentRegion.regionName;
        }
        const p = new StartLureMessage();
        p.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        p.Info = {
            LureType: 0,
            Message: Utils.StringToBuffer(message)
        }
        p.TargetData = [{
          TargetID: target
        }];
        const sequenceNo = this.circuit.sendMessage(p, PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async stopTypingLocal(): Promise<void>
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
        await this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async startTypingIM(to: UUID | string): Promise<void>
    {
        if (typeof to === 'string')
        {
            to = new UUID(to);
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
        await circuit.waitForAck(sequenceNo, 10000);
    }

    public async stopTypingIM(to: UUID | string): Promise<void>
    {
        if (typeof to === 'string')
        {
            to = new UUID(to);
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
        await circuit.waitForAck(sequenceNo, 10000);
    }

    public async typeInstantMessage(to: UUID | string, message: string, thinkingTime?: number, charactersPerSecond?: number): Promise<void>
    {
        if (thinkingTime === undefined)
        {
            thinkingTime = 2000;
        }
        await Utils.sleep(thinkingTime);

        if (typeof to === 'string')
        {
            to = new UUID(to);
        }
        let typeTimer: NodeJS.Timeout | null = null;
        await this.startTypingIM(to);
        typeTimer = setInterval(() =>
        {
            // Send a new typing message ever 5 secs
            // or it will time out at the other end
            void this.startTypingIM(to);
        }, 5000);
        if (charactersPerSecond === undefined)
        {
            charactersPerSecond = 5;
        }
        const timeToWait = (message.length / charactersPerSecond) * 1000;
        await Utils.sleep(timeToWait);
        if (typeTimer !== null)
        {
            clearInterval(typeTimer);
            typeTimer = null;
        }
        await this.stopTypingIM(to);
        await this.sendInstantMessage(to, message);
    }

    public async typeLocalMessage(message: string, thinkingTime?: number, charactersPerSecond?: number): Promise<void>
    {
        if (thinkingTime === undefined)
        {
            thinkingTime = 0;
        }
        await Utils.sleep(thinkingTime);
        await this.startTypingLocal();
        await this.bot.clientCommands.agent.startAnimations([new UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]);
        if (charactersPerSecond === undefined)
        {
            charactersPerSecond = 5;
        }
        const timeToWait = (message.length / charactersPerSecond) * 1000;
        await Utils.sleep(timeToWait);
        await this.stopTypingLocal();
        await this.bot.clientCommands.agent.stopAnimations([new UUID('c541c47f-e0c0-058b-ad1a-d6ae3a4584d9')]);
        await this.say(message);
    }

    public async endGroupChatSession(groupID: UUID | string): Promise<void>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }
        if (!this.agent.hasChatSession(groupID))
        {
            throw new Error('Group session does not exist');
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
            Dialog: InstantMessageDialog.SessionDrop,
            ID: groupID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Buffer.allocUnsafe(0),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        this.agent.deleteChatSession(groupID);
        const sequenceNo = this.circuit.sendMessage(im, PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }

    public async startGroupChatSession(groupID: UUID | string, message: string): Promise<void>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }

        if (this.agent.hasChatSession(groupID))
        {
            return;
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
            Dialog: InstantMessageDialog.SessionGroupStart,
            ID: groupID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(message),
            BinaryBucket: Utils.StringToBuffer('')
        };
        im.EstateBlock = {
            EstateID: 0
        };
        circuit.sendMessage(im, PacketFlags.Reliable);
        await Utils.waitOrTimeOut(this.currentRegion.clientEvents.onGroupChatSessionJoin, 10000, (event: GroupChatSessionJoinEvent) =>
        {
            if (event.sessionID.toString() === groupID.toString())
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });
    }

    public async moderateGroupChat(groupID: UUID | string, memberID: UUID | string, muteText: boolean, muteVoice: boolean): Promise<any>
    {
        if (typeof groupID === 'object')
        {
            groupID = groupID.toString();
        }
        if (typeof memberID === 'object')
        {
            memberID = memberID.toString();
        }
        await this.startGroupChatSession(groupID, '');
        const requested = {
            'method': 'mute update',
            'params': {
                'agent_id': new LLSD.UUID(memberID),
                'mute_info': {
                    'voice': muteVoice,
                    'text': muteText
                }
            },
            'session-id': new LLSD.UUID(groupID),
        };
        return this.currentRegion.caps.capsPostXML('ChatSessionRequest', requested);
    }

    public async sendGroupMessage(groupID: UUID | string, message: string): Promise<number>
    {
        if (typeof groupID === 'string')
        {
            groupID = new UUID(groupID);
        }

        if (!this.agent.hasChatSession(groupID))
        {
            await this.startGroupChatSession(groupID, message);
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
        await this.circuit.waitForAck(sequenceNo, 10000);

        return this.bot.clientCommands.group.getSessionAgentCount(groupID);
    }

    public async respondToScriptDialog(event: ScriptDialogEvent, buttonIndex: number): Promise<void>
    {
        const dialog: ScriptDialogReplyMessage = new ScriptDialogReplyMessage();
        dialog.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        dialog.Data = {
            ObjectID: event.ObjectID,
            ChatChannel: event.ChatChannel,
            ButtonIndex: buttonIndex,
            ButtonLabel: Utils.StringToBuffer(event.Buttons[buttonIndex])
        };
        const sequenceNo = this.circuit.sendMessage(dialog, PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceNo, 10000);
    }
}
