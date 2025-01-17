import { UUID } from './UUID';
import { Vector3 } from './Vector3';
import { Inventory } from './Inventory';
import type { Wearable } from './Wearable';
import type { Region } from './Region';
import { Message } from '../enums/Message';
import type { Packet } from './Packet';
import type { AvatarAnimationMessage } from './messages/AvatarAnimation';
import { AgentUpdateMessage } from './messages/AgentUpdate';
import { Quaternion } from './Quaternion';
import { AgentState } from '../enums/AgentState';
import { BuiltInAnimations } from '../enums/BuiltInAnimations';
import { AgentWearablesRequestMessage } from './messages/AgentWearablesRequest';
import type { AgentWearablesUpdateMessage } from './messages/AgentWearablesUpdate';
import { RezSingleAttachmentFromInvMessage } from './messages/RezSingleAttachmentFromInv';
import { AttachmentPoint } from '../enums/AttachmentPoint';
import { Utils } from './Utils';
import type { ClientEvents } from './ClientEvents';
import type * as Long from 'long';
import type { GroupChatSessionAgentListEvent } from '../events/GroupChatSessionAgentListEvent';
import { AgentFlags } from '../enums/AgentFlags';
import { ControlFlags } from '../enums/ControlFlags';
import { PacketFlags } from '../enums/PacketFlags';
import { FolderType } from '../enums/FolderType';
import type { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { InventoryFolder } from './InventoryFolder';
import { BulkUpdateInventoryEvent } from '../events/BulkUpdateInventoryEvent';
import type { BulkUpdateInventoryMessage } from './messages/BulkUpdateInventory';
import { InventoryItem } from './InventoryItem';
import type { AgentDataUpdateMessage } from './messages/AgentDataUpdate';
import { InventoryLibrary } from '../enums/InventoryLibrary';
import { AssetType } from '../enums/AssetType';

export class Agent
{
    public firstName: string;
    public lastName: string;
    public localID = 0;
    public agentID: UUID;
    public activeGroupID: UUID = UUID.zero();
    public accessMax: string;
    public regionAccess: string;
    public agentAccess: string;
    public currentRegion: Region;

    public openID: {
        'token'?: string,
        'url'?: string
    } = {};
    public AOTransition: boolean;
    public buddyList: {
        'buddyRightsGiven': boolean,
        'buddyID': UUID,
        'buddyRightsHas': boolean
    }[] = [];
    public uiFlags: {
        'allowFirstLife'?: boolean
    } = {};
    public maxGroups: number;
    public agentFlags: number;
    public startLocation: string;
    public cofVersion: number;
    public home: {
        'regionHandle'?: Long,
        'position'?: Vector3,
        'lookAt'?: Vector3
    } = {};
    public snapshotConfigURL: string;
    public readonly inventory: Inventory;
    public gestures: {
        assetID: UUID,
        itemID: UUID
    }[] = [];
    public estateManager = false;
    public appearanceComplete = false;
    public agentAppearanceService: string;
    public onGroupChatExpired = new Subject<UUID>();
    public cameraLookAt: Vector3 = new Vector3([0.979546, 0.105575, -0.171303]);
    public cameraCenter: Vector3 = new Vector3([199.58, 203.95, 24.304]);
    public cameraLeftAxis: Vector3 = new Vector3([-1.0, 0.0, 0]);
    public cameraUpAxis: Vector3 = new Vector3([0.0, 0.0, 1.0]);
    public cameraFar = 1;
    public readonly appearanceCompleteEvent: Subject<void> = new Subject<void>();

    private readonly headRotation = Quaternion.getIdentity();
    private readonly bodyRotation = Quaternion.getIdentity();

    private wearables?: {
        attachments: Wearable[];
        serialNumber: number
    };
    private agentUpdateTimer: NodeJS.Timeout | null = null;

    private controlFlags: ControlFlags = 0;

    private readonly clientEvents: ClientEvents;
    private animSubscription?: Subscription;
    private readonly chatSessions = new Map<string, {
        agents: Map<string, {
            hasVoice: boolean;
            isModerator: boolean
        }>,
        timeout?: NodeJS.Timeout
    }>();


    public constructor(clientEvents: ClientEvents)
    {
        this.inventory = new Inventory(this);
        this.clientEvents = clientEvents;
        this.clientEvents.onGroupChatAgentListUpdate.subscribe((event: GroupChatSessionAgentListEvent) =>
        {
            const str = event.groupID.toString();

            const agent = event.agentID.toString();

            const session = this.chatSessions.get(str);
            if (session === undefined)
            {
                return;
            }

            if (event.entered)
            {
                if (session.agents === undefined)
                {
                    session.agents = new Map<string, {
                        hasVoice: boolean;
                        isModerator: boolean
                    }>();
                }
                session.agents.set(agent, {
                    hasVoice: event.canVoiceChat,
                    isModerator: event.isModerator
                });
            }
            else
            {
                session.agents.delete(agent);
            }
        });
    }

    public updateLastMessage(groupID: UUID): void
    {
        const str = groupID.toString();
        const entry = this.chatSessions.get(str);
        if (entry === undefined)
        {
            return;
        }
        if (entry.timeout !== undefined)
        {
            clearInterval(entry.timeout);
            entry.timeout = setTimeout(this.groupChatExpired.bind(this, groupID), 900000);
        }
    }

    public setIsEstateManager(is: boolean): void
    {
        this.estateManager = is;
    }

    public getSessionAgentCount(uuid: UUID): number
    {
        const str = uuid.toString();
        const session = this.chatSessions.get(str);
        if (session === undefined)
        {
            return 0;
        }
        else
        {
            return session.agents.size;
        }
    }

    public addChatSession(uuid: UUID, timeout: boolean): boolean
    {
        const str = uuid.toString();
        if (this.chatSessions.has(str))
        {
            return false;
        }
        this.chatSessions.set(str, {
            agents: new Map<string, {
                hasVoice: boolean,
                isModerator: boolean
            }>(),
            timeout: timeout ? setTimeout(this.groupChatExpired.bind(this, uuid), 900000) : undefined
        });
        return true;
    }

    public groupChatExpired(groupID: UUID): void
    {
        this.onGroupChatExpired.next(groupID);
    }

    public hasChatSession(uuid: UUID): boolean
    {
        const str = uuid.toString();
        return this.chatSessions.has(str);
    }

    public deleteChatSession(uuid: UUID): boolean
    {
        const str = uuid.toString();
        if (!this.chatSessions.has(str))
        {
            return false;
        }
        this.chatSessions.delete(str);
        return true;
    }

    public setCurrentRegion(region: Region): void
    {
        if (this.animSubscription !== undefined)
        {
            this.animSubscription.unsubscribe();
        }
        this.currentRegion = region;
        this.animSubscription = this.currentRegion.circuit.subscribeToMessages([
            Message.AvatarAnimation,
            Message.AgentDataUpdate,
            Message.BulkUpdateInventory
        ], this.onMessage.bind(this));
    }

    public circuitActive(): void
    {
        this.agentUpdateTimer = setInterval(this.sendAgentUpdate.bind(this), 1000);
    }

    public shutdown(): void
    {
        if (this.agentUpdateTimer !== null)
        {
            clearInterval(this.agentUpdateTimer);
            this.agentUpdateTimer = null;
        }
    }

    public async setInitialAppearance(): Promise<void>
    {
        const circuit = this.currentRegion.circuit;
        const wearablesRequest: AgentWearablesRequestMessage = new AgentWearablesRequestMessage();
        wearablesRequest.AgentData = {
            AgentID: this.agentID,
            SessionID: circuit.sessionID
        };
        circuit.sendMessage(wearablesRequest, PacketFlags.Reliable);

        const wearables: AgentWearablesUpdateMessage = await circuit.waitForMessage<AgentWearablesUpdateMessage>(Message.AgentWearablesUpdate, 30000);

        if (!this.wearables || wearables.AgentData.SerialNum > this.wearables.serialNumber)
        {
            this.wearables = {
                serialNumber: wearables.AgentData.SerialNum,
                attachments: []
            };
            for (const wearable of wearables.WearableData)
            {
                if (this.wearables.attachments)
                {
                    this.wearables.attachments.push({
                        itemID: wearable.ItemID,
                        assetID: wearable.AssetID,
                        wearableType: wearable.WearableType
                    });
                }
            }
        }


        const currentOutfitFolder = await this.getWearables();
        const wornObjects = this.currentRegion.objects.getObjectsByParent(this.localID);
        for (const item of currentOutfitFolder.items)
        {
            if (item.type === AssetType.Notecard)
            {
                let found = false;
                for (const obj of wornObjects)
                {
                    if (obj.hasNameValueEntry('AttachItemID'))
                    {
                        if (item.itemID.toString() === obj.getNameValueEntry('AttachItemID'))
                        {
                            found = true;
                        }
                    }
                }

                if (!found)
                {
                    const rsafi = new RezSingleAttachmentFromInvMessage();
                    rsafi.AgentData = {
                        AgentID: this.agentID,
                        SessionID: circuit.sessionID
                    };
                    rsafi.ObjectData = {
                        ItemID: new UUID(item.itemID.toString()),
                        OwnerID: this.agentID,
                        AttachmentPt: 0x80 | AttachmentPoint.Default,
                        ItemFlags: item.flags,
                        GroupMask: item.permissions.groupMask,
                        EveryoneMask: item.permissions.everyoneMask,
                        NextOwnerMask: item.permissions.nextOwnerMask,
                        Name: Utils.StringToBuffer(item.name),
                        Description: Utils.StringToBuffer(item.description)
                    };
                    circuit.sendMessage(rsafi, PacketFlags.Reliable);
                }
            }
        }
        this.appearanceComplete = true;
        this.appearanceCompleteEvent.next();
    }

    public setControlFlag(flag: ControlFlags): void
    {
        this.controlFlags = this.controlFlags | flag;
    }

    public clearControlFlag(flag: ControlFlags): void
    {
        this.controlFlags = this.controlFlags & ~flag;
    }

    public async getWearables(): Promise<InventoryFolder>
    {
        for (const uuid of this.inventory.main.skeleton.keys())
        {
            const folder = this.inventory.main.skeleton.get(uuid);
            if (folder && folder.typeDefault === FolderType.CurrentOutfit)
            {
                await folder.populate(false);
                return folder;
            }
        }
        throw new Error('Unable to get wearables from inventory')
    }

    public sendAgentUpdate(): void
    {
        if (!this.currentRegion)
        {
            return;
        }
        const circuit = this.currentRegion.circuit;
        const agentUpdate: AgentUpdateMessage = new AgentUpdateMessage();
        agentUpdate.AgentData = {
            AgentID: this.agentID,
            SessionID: circuit.sessionID,
            HeadRotation: this.headRotation,
            BodyRotation: this.bodyRotation,
            State: AgentState.None,
            CameraCenter: this.cameraCenter,
            CameraAtAxis: this.cameraLookAt,
            CameraLeftAxis: this.cameraLeftAxis,
            CameraUpAxis: this.cameraUpAxis,
            Far: this.cameraFar,
            ControlFlags: this.controlFlags,
            Flags: AgentFlags.None
        };
        circuit.sendMessage(agentUpdate, 0 as PacketFlags);
    }

    private onMessage(packet: Packet): void
    {
        if (packet.message.id === Message.AgentDataUpdate)
        {
            const msg = packet.message as AgentDataUpdateMessage;
            this.activeGroupID = msg.AgentData.ActiveGroupID;
        }
        else if (packet.message.id === Message.BulkUpdateInventory)
        {
            const msg = packet.message as BulkUpdateInventoryMessage;
            const evt = new BulkUpdateInventoryEvent();

            for (const newItem of msg.ItemData)
            {
                const folder = this.inventory.findFolder(newItem.FolderID);
                const item = new InventoryItem(folder ?? undefined, this);
                item.assetID = newItem.AssetID;
                item.inventoryType = newItem.InvType;
                item.name = Utils.BufferToStringSimple(newItem.Name);
                item.salePrice = newItem.SalePrice;
                item.saleType = newItem.SaleType;
                item.created = new Date(newItem.CreationDate * 1000);
                item.parentID = newItem.FolderID;
                item.flags = newItem.Flags;
                item.itemID = newItem.ItemID;
                item.description = Utils.BufferToStringSimple(newItem.Description);
                item.type = newItem.Type;
                item.callbackID = newItem.CallbackID;
                item.permissions.baseMask = newItem.BaseMask;
                item.permissions.groupMask = newItem.GroupMask;
                item.permissions.nextOwnerMask = newItem.NextOwnerMask;
                item.permissions.ownerMask = newItem.OwnerMask;
                item.permissions.everyoneMask = newItem.EveryoneMask;
                item.permissions.owner = newItem.OwnerID;
                item.permissions.creator = newItem.CreatorID;
                item.permissions.group = newItem.GroupID;
                item.permissions.groupOwned = newItem.GroupOwned;
                evt.itemData.push(item);
            }
            for (const newFolder of msg.FolderData)
            {
                const fld = new InventoryFolder(InventoryLibrary.Main, this.inventory.main, this);
                fld.typeDefault = newFolder.Type;
                fld.name = Utils.BufferToStringSimple(newFolder.Name);
                fld.folderID = newFolder.FolderID;
                fld.parentID = newFolder.ParentID;
                evt.folderData.push(fld);
            }
            this.clientEvents.onBulkUpdateInventoryEvent.next(evt);
        }
        else if (packet.message.id === Message.AvatarAnimation)
        {
            const animMsg = packet.message as AvatarAnimationMessage;
            if (animMsg.Sender.ID.toString() === this.agentID.toString())
            {
                for (const anim of animMsg.AnimationList)
                {
                    const a = anim.AnimID.toString() as BuiltInAnimations;
                    if (a === BuiltInAnimations.STANDUP ||
                        a === BuiltInAnimations.PRE_JUMP ||
                        a === BuiltInAnimations.LAND ||
                        a === BuiltInAnimations.MEDIUM_LAND ||
                        a === BuiltInAnimations.WALK ||
                        a === BuiltInAnimations.RUN)
                    {
                        // TODO: Pretty sure this isn't the best way to do this
                        this.controlFlags = ControlFlags.AGENT_CONTROL_FINISH_ANIM;
                        this.sendAgentUpdate();
                        this.controlFlags = 0;
                    }
                }
            }
        }
    }
}
