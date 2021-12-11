import { UUID } from './UUID';
import { Vector3 } from './Vector3';
import { Inventory } from './Inventory';
import { Wearable } from './Wearable';
import { Region } from './Region';
import { Message } from '../enums/Message';
import { Packet } from './Packet';
import { AvatarAnimationMessage } from './messages/AvatarAnimation';
import { AgentUpdateMessage } from './messages/AgentUpdate';
import { Quaternion } from './Quaternion';
import { AgentState } from '../enums/AgentState';
import { BuiltInAnimations } from '../enums/BuiltInAnimations';
import { AgentWearablesRequestMessage } from './messages/AgentWearablesRequest';
import { AgentWearablesUpdateMessage } from './messages/AgentWearablesUpdate';
import { RezSingleAttachmentFromInvMessage } from './messages/RezSingleAttachmentFromInv';
import { AttachmentPoint } from '../enums/AttachmentPoint';
import { Utils } from './Utils';
import { ClientEvents } from './ClientEvents';
import * as Long from 'long';
import { GroupChatSessionAgentListEvent } from '../events/GroupChatSessionAgentListEvent';
import { AgentFlags } from '../enums/AgentFlags';
import { ControlFlags } from '../enums/ControlFlags';
import { PacketFlags } from '../enums/PacketFlags';
import { FolderType } from '../enums/FolderType';
import { Subject, Subscription } from 'rxjs';
import { InventoryFolder } from './InventoryFolder';
import { BulkUpdateInventoryEvent } from '../events/BulkUpdateInventoryEvent';
import { BulkUpdateInventoryMessage } from './messages/BulkUpdateInventory';
import { InventoryItem } from './InventoryItem';
import { AgentDataUpdateMessage } from './messages/AgentDataUpdate';
import { InventoryLibrary } from '../enums/InventoryLibrary';
import Timer = NodeJS.Timer;

export class Agent
{
    firstName: string;
    lastName: string;
    localID = 0;
    agentID: UUID;
    activeGroupID: UUID = UUID.zero();
    accessMax: string;
    regionAccess: string;
    agentAccess: string;
    currentRegion: Region;
    chatSessions: { [key: string]: {
            [key: string]: {
                hasVoice: boolean,
                isModerator: boolean
            }
        } } = {};
    controlFlags: ControlFlags = 0;
    openID: {
        'token'?: string,
        'url'?: string
    } = {};
    AOTransition: boolean;
    buddyList: {
        'buddyRightsGiven': boolean,
        'buddyID': UUID,
        'buddyRightsHas': boolean
    }[] = [];
    uiFlags: {
        'allowFirstLife'?: boolean
    } = {};
    cameraLookAt: Vector3 = new Vector3([0.979546, 0.105575, -0.171303]);
    cameraCenter: Vector3 = new Vector3([199.58, 203.95, 24.304]);
    cameraLeftAxis: Vector3 = new Vector3([-1.0, 0.0, 0]);
    cameraUpAxis: Vector3 = new Vector3([0.0, 0.0, 1.0]);
    cameraFar = 1;
    maxGroups: number;
    agentFlags: number;
    startLocation: string;
    cofVersion: number;
    home: {
        'regionHandle'?: Long,
        'position'?: Vector3,
        'lookAt'?: Vector3
    } = {};
    snapshotConfigURL: string;
    inventory: Inventory;
    gestures: {
        assetID: UUID,
        itemID: UUID
    }[] = [];
    agentAppearanceService: string;
    wearables?: {
        attachments: Wearable[];
        serialNumber: number
    };
    agentUpdateTimer: Timer | null = null;
    estateManager = false;

    appearanceComplete = false;
    appearanceCompleteEvent: Subject<void> = new Subject<void>();

    private clientEvents: ClientEvents;
    private animSubscription?: Subscription;

    constructor(clientEvents: ClientEvents)
    {
        this.inventory = new Inventory(clientEvents, this);
        this.clientEvents = clientEvents;
        this.clientEvents.onGroupChatAgentListUpdate.subscribe((event: GroupChatSessionAgentListEvent) =>
        {
            const str = event.groupID.toString();
            if (this.chatSessions[str] === undefined)
            {
                this.chatSessions[str] = {};
            }

            const agent = event.agentID.toString();

            if (event.entered)
            {
                this.chatSessions[str][agent] = {
                    hasVoice: event.canVoiceChat,
                    isModerator: event.isModerator
                }
            }
            else
            {
                delete this.chatSessions[str][agent];
            }
        });
    }

    setIsEstateManager(is: boolean): void
    {
        this.estateManager = is;
    }

    getSessionAgentCount(uuid: UUID): number
    {
        const str = uuid.toString();
        if (this.chatSessions[str] === undefined)
        {
            return 0;
        }
        else
        {
            return Object.keys(this.chatSessions[str]).length;
        }
    }

    addChatSession(uuid: UUID): void
    {
        const str = uuid.toString();
        if (this.chatSessions[str] === undefined)
        {
            this.chatSessions[str] = {};
        }
    }

    hasChatSession(uuid: UUID): boolean
    {
        const str = uuid.toString();
        return !(this.chatSessions[str] === undefined);
    }

    setCurrentRegion(region: Region): void
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
    circuitActive(): void
    {
        this.agentUpdateTimer = setInterval(this.sendAgentUpdate.bind(this), 1000);
    }
    sendAgentUpdate(): void
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
            HeadRotation: Quaternion.getIdentity(),
            BodyRotation: Quaternion.getIdentity(),
            State: AgentState.None,
            CameraCenter: this.cameraCenter,
            CameraAtAxis: this.cameraLookAt,
            CameraLeftAxis: this.cameraLeftAxis,
            CameraUpAxis: this.cameraUpAxis,
            Far: this.cameraFar,
            ControlFlags: this.controlFlags,
            Flags: AgentFlags.None
        };
        circuit.sendMessage(agentUpdate, 0);
    }
    shutdown(): void
    {
        if (this.agentUpdateTimer !== null)
        {
            clearInterval(this.agentUpdateTimer);
            this.agentUpdateTimer = null;
        }
    }
    onMessage(packet: Packet): void
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
                const item = new InventoryItem(folder || undefined, this);
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
                    const a = anim.AnimID.toString();
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

    async getWearables(): Promise<InventoryFolder>
    {
        for (const uuid of Object.keys(this.inventory.main.skeleton))
        {
            const folder = this.inventory.main.skeleton[uuid];
            if (folder.typeDefault === FolderType.CurrentOutfit)
            {
                await folder.populate(false);
                return folder;
            }
        }
        throw new Error('Unable to get wearables from inventory')
    }

    async setInitialAppearance(): Promise<void>
    {
        const circuit = this.currentRegion.circuit;
        const wearablesRequest: AgentWearablesRequestMessage = new AgentWearablesRequestMessage();
        wearablesRequest.AgentData = {
            AgentID: this.agentID,
            SessionID: circuit.sessionID
        };
        circuit.sendMessage(wearablesRequest, PacketFlags.Reliable);

        const wearables: AgentWearablesUpdateMessage = await circuit.waitForMessage<AgentWearablesUpdateMessage>(Message.AgentWearablesUpdate, 10000);

        if (!this.wearables || wearables.AgentData.SerialNum > this.wearables.serialNumber)
        {
            this.wearables = {
                serialNumber: wearables.AgentData.SerialNum,
                attachments: []
            };
            for (const wearable of wearables.WearableData)
            {
                if (this.wearables && this.wearables.attachments)
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
            if (item.type === 6)
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

    setControlFlag(flag: ControlFlags): void
    {
        this.controlFlags = this.controlFlags | flag;
    }

    clearControlFlag(flag: ControlFlags): void
    {
        this.controlFlags = this.controlFlags & ~flag;
    }
}
