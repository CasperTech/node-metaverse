import { InventoryFolder } from '../InventoryFolder';
import { UUID } from '../UUID';
import { AgentAnimationMessage } from '../messages/AgentAnimation';
import { PacketFlags } from '../../enums/PacketFlags';
import { CommandsBase } from './CommandsBase';
import { Vector3 } from '../Vector3';
import { Message } from '../../enums/Message';
import { Utils } from '../Utils';
import { FilterResponse } from '../../enums/FilterResponse';
import { AvatarPropertiesReplyMessage } from '../messages/AvatarPropertiesReply';
import { AvatarPropertiesRequestMessage } from '../messages/AvatarPropertiesRequest';
import { AvatarPropertiesReplyEvent } from '../../events/AvatarPropertiesReplyEvent';
import { Subscription } from 'rxjs';
import { Avatar } from '../public/Avatar';

export class AgentCommands extends CommandsBase
{
    private async animate(anim: UUID[], run: boolean): Promise<void>
    {

        const circuit = this.currentRegion.circuit;
        const animPacket = new AgentAnimationMessage();
        animPacket.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        animPacket.PhysicalAvatarEventList = [];
        animPacket.AnimationList = [];
        for (const a of anim)
        {
            animPacket.AnimationList.push({
                AnimID: a,
                StartAnim: run
            });
        }

        return await circuit.waitForAck(circuit.sendMessage(animPacket, PacketFlags.Reliable), 10000);
    }

    async startAnimations(anim: UUID[]): Promise<void>
    {
        return await this.animate(anim, true);
    }

    async stopAnimations(anim: UUID[]): Promise<void>
    {
        return await this.animate(anim, false);
    }

    setCamera(position: Vector3, lookAt: Vector3, viewDistance?: number, leftAxis?: Vector3, upAxis?: Vector3): void
    {
        this.agent.cameraCenter = position;
        this.agent.cameraLookAt = lookAt;
        if (viewDistance !== undefined)
        {
            this.agent.cameraFar = viewDistance;
        }
        if (leftAxis !== undefined)
        {
            this.agent.cameraLeftAxis = leftAxis;
        }
        if (upAxis !== undefined)
        {
            this.agent.cameraUpAxis = upAxis;
        }
        this.agent.sendAgentUpdate();
    }

    setViewDistance(viewDistance: number): void
    {
        this.agent.cameraFar = viewDistance;
        this.agent.sendAgentUpdate();
    }

    async getWearables(): Promise<InventoryFolder>
    {
        return this.agent.getWearables();
    }

    waitForAppearanceComplete(timeout: number = 30000): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.agent.appearanceComplete)
            {
                resolve();
            }
            else
            {
                let appearanceSubscription: Subscription | undefined;
                let timeoutTimer: number | undefined;
                appearanceSubscription = this.agent.appearanceCompleteEvent.subscribe(() =>
                {
                    if (timeoutTimer !== undefined)
                    {
                        clearTimeout(timeoutTimer);
                        timeoutTimer = undefined;
                    }
                    if (appearanceSubscription !== undefined)
                    {
                        appearanceSubscription.unsubscribe();
                        appearanceSubscription = undefined;
                        resolve();
                    }
                });
                timeoutTimer = setTimeout(() =>
                {
                    if (appearanceSubscription !== undefined)
                    {
                        appearanceSubscription.unsubscribe();
                        appearanceSubscription = undefined;
                    }
                    if (timeoutTimer !== undefined)
                    {
                        clearTimeout(timeoutTimer);
                        timeoutTimer = undefined;
                        reject(new Error('Timeout'));
                    }
                }, timeout) as any as number;
                if (this.agent.appearanceComplete)
                {
                    if (appearanceSubscription !== undefined)
                    {
                        appearanceSubscription.unsubscribe();
                        appearanceSubscription = undefined;
                    }
                    if (timeoutTimer !== undefined)
                    {
                        clearTimeout(timeoutTimer);
                        timeoutTimer = undefined;
                    }
                    resolve();
                }
            }
        });
    }

    getAvatar(avatarID: UUID | string = UUID.zero()): Avatar | undefined
    {
        if (typeof avatarID === 'string')
        {
            avatarID = new UUID(avatarID);
        }
        else if (avatarID.isZero())
        {
            avatarID = this.agent.agentID;
        }
        return this.currentRegion.agents[avatarID.toString()];
    }

    async getAvatarProperties(avatarID: UUID | string): Promise<AvatarPropertiesReplyEvent>
    {
        if (typeof avatarID === 'string')
        {
            avatarID = new UUID(avatarID);
        }

        const msg: AvatarPropertiesRequestMessage = new AvatarPropertiesRequestMessage();

        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID,
            AvatarID: avatarID
        };

        this.circuit.sendMessage(msg, PacketFlags.Reliable);

        const avatarPropertiesReply: AvatarPropertiesReplyMessage = (await this.circuit.waitForMessage(Message.AvatarPropertiesReply, 10000, (packet: AvatarPropertiesReplyMessage): FilterResponse =>
        {
            const replyMessage: AvatarPropertiesReplyMessage = packet as AvatarPropertiesReplyMessage;
            if (replyMessage.AgentData.AvatarID.equals(avatarID))
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        })) as AvatarPropertiesReplyMessage;

        return new class implements AvatarPropertiesReplyEvent
        {
            ImageID = avatarPropertiesReply.PropertiesData.ImageID;
            FLImageID = avatarPropertiesReply.PropertiesData.FLImageID;
            PartnerID = avatarPropertiesReply.PropertiesData.PartnerID;
            AboutText = Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.AboutText);
            FLAboutText = Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.FLAboutText);
            BornOn = Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.BornOn);
            ProfileURL = Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.ProfileURL);
            CharterMember = parseInt(Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.CharterMember), 10); // avatarPropertiesReply.PropertiesData.CharterMember;
            Flags = avatarPropertiesReply.PropertiesData.Flags;
        };
    }
}
