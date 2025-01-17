import type { InventoryFolder } from '../InventoryFolder';
import { UUID } from '../UUID';
import { AgentAnimationMessage } from '../messages/AgentAnimation';
import { PacketFlags } from '../../enums/PacketFlags';
import { CommandsBase } from './CommandsBase';
import type { Vector3 } from '../Vector3';
import { Message } from '../../enums/Message';
import { Utils } from '../Utils';
import { FilterResponse } from '../../enums/FilterResponse';
import type { AvatarPropertiesReplyMessage } from '../messages/AvatarPropertiesReply';
import { AvatarPropertiesRequestMessage } from '../messages/AvatarPropertiesRequest';
import type { AvatarPropertiesReplyEvent } from '../../events/AvatarPropertiesReplyEvent';
import type { Subscription } from 'rxjs';
import type { Avatar } from '../public/Avatar';
import type { GameObject } from '../public/GameObject';

export class AgentCommands extends CommandsBase
{
    public async startAnimations(anim: UUID[]): Promise<void>
    {
        return this.animate(anim, true);
    }

    public async stopAnimations(anim: UUID[]): Promise<void>
    {
        return this.animate(anim, false);
    }

    public setCamera(position: Vector3, lookAt: Vector3, viewDistance?: number, leftAxis?: Vector3, upAxis?: Vector3): void
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

    // noinspection JSUnusedGlobalSymbols
    public setViewDistance(viewDistance: number): void
    {
        this.agent.cameraFar = viewDistance;
        this.agent.sendAgentUpdate();
    }

    // noinspection JSUnusedGlobalSymbols
    public getGameObject(): GameObject
    {
        const agentLocalID = this.currentRegion.agent.localID;
        return this.currentRegion.objects.getObjectByLocalID(agentLocalID);
    }

    // noinspection JSUnusedGlobalSymbols
    public async getWearables(): Promise<InventoryFolder>
    {
        return this.agent.getWearables();
    }

    // noinspection JSUnusedGlobalSymbols
    public async waitForAppearanceComplete(timeout = 30000): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.agent.appearanceComplete)
            {
                resolve();
            }
            else
            {
                let appearanceSubscription: Subscription | undefined = undefined;
                let timeoutTimer: number | undefined = undefined;
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
                }, timeout) as unknown as number;
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

    // noinspection JSUnusedGlobalSymbols
    public getAvatar(avatarID: UUID | string = UUID.zero()): Avatar | undefined
    {
        if (typeof avatarID === 'string')
        {
            avatarID = new UUID(avatarID);
        }
        else if (avatarID.isZero())
        {
            avatarID = this.agent.agentID;
        }
        return this.currentRegion.agents.get(avatarID.toString());
    }

    // noinspection JSUnusedGlobalSymbols
    public async getAvatarProperties(avatarID: UUID | string): Promise<AvatarPropertiesReplyEvent>
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
            if (packet.AgentData.AvatarID.equals(avatarID))
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        }));

        return new class implements AvatarPropertiesReplyEvent
        {
            public ImageID = avatarPropertiesReply.PropertiesData.ImageID;
            public FLImageID = avatarPropertiesReply.PropertiesData.FLImageID;
            public PartnerID = avatarPropertiesReply.PropertiesData.PartnerID;
            public AboutText = Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.AboutText);
            public FLAboutText = Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.FLAboutText);
            public BornOn = Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.BornOn);
            public ProfileURL = Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.ProfileURL);
            public CharterMember = parseInt(Utils.BufferToStringSimple(avatarPropertiesReply.PropertiesData.CharterMember), 10); // avatarPropertiesReply.PropertiesData.CharterMember;
            public Flags = avatarPropertiesReply.PropertiesData.Flags;
        };
    }

    private async animate(anim: UUID[], run: boolean): Promise<void>
    {

        const {circuit} = this.currentRegion;
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

        await circuit.waitForAck(circuit.sendMessage(animPacket, PacketFlags.Reliable), 10000);
    }
}
