import {UUID} from './UUID';
import {Vector3} from './Vector3';
import {Inventory} from './Inventory';
import Long = require('long');
import {Wearable} from './Wearable';
import {Region} from './Region';
import {Message} from '../enums/Message';
import {Packet} from './Packet';
import {AvatarAnimationMessage} from './messages/AvatarAnimation';
import {AgentUpdateMessage} from './messages/AgentUpdate';
import {Quaternion} from './Quaternion';
import {AgentState} from '../enums/AgentState';
import {BuiltInAnimations} from '../enums/BuiltInAnimations';
import * as LLSD from '@caspertech/llsd';
import {AgentWearablesRequestMessage} from './messages/AgentWearablesRequest';
import {AgentWearablesUpdateMessage} from './messages/AgentWearablesUpdate';
import {InventorySortOrder} from '../enums/InventorySortOrder';
import {RezSingleAttachmentFromInvMessage} from './messages/RezSingleAttachmentFromInv';
import {AttachmentPoint} from '../enums/AttachmentPoint';
import {Utils} from './Utils';
import {ClientEvents} from './ClientEvents';
import Timer = NodeJS.Timer;
import {ControlFlags, GroupChatSessionAgentListEvent, AgentFlags, PacketFlags, AssetType} from '..';
import {GameObject} from './public/GameObject';

export class Agent
{
    firstName: string;
    lastName: string;
    localID = 0;
    agentID: UUID;
    accessMax: string;
    regionAccess: string;
    agentAccess: string;
    currentRegion: Region;
    chatSessions: {[key: string]: {
            [key: string]: {
                hasVoice: boolean,
                isModerator: boolean
            }
        }} = {};
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
    private clientEvents: ClientEvents;

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

    addChatSession(uuid: UUID)
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

    setCurrentRegion(region: Region)
    {
        this.currentRegion = region;
        this.currentRegion.circuit.subscribeToMessages([
            Message.AvatarAnimation
        ], this.onAnimState.bind(this));
    }
    circuitActive()
    {
        this.agentUpdateTimer = setInterval(this.sendAgentUpdate.bind(this), 1000);
    }
    sendAgentUpdate()
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
    shutdown()
    {
        if (this.agentUpdateTimer !== null)
        {
            clearInterval(this.agentUpdateTimer);
            this.agentUpdateTimer = null;
        }
    }
    onAnimState(packet: Packet)
    {
        if (packet.message.id === Message.AvatarAnimation)
        {
            const animMsg = packet.message as AvatarAnimationMessage;
            if (animMsg.Sender.ID.toString() === this.agentID.toString())
            {
                animMsg.AnimationList.forEach((anim) =>
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
                });
            }
        }
    }
    setInitialAppearance()
    {
        const circuit = this.currentRegion.circuit;
        const wearablesRequest: AgentWearablesRequestMessage = new AgentWearablesRequestMessage();
        wearablesRequest.AgentData = {
            AgentID: this.agentID,
            SessionID: circuit.sessionID
        };
        circuit.sendMessage(wearablesRequest, PacketFlags.Reliable);
        circuit.waitForMessage<AgentWearablesUpdateMessage>(Message.AgentWearablesUpdate, 10000).then((wearables: AgentWearablesUpdateMessage) =>
        {
            if (!this.wearables || wearables.AgentData.SerialNum > this.wearables.serialNumber)
            {
                this.wearables = {
                    serialNumber: wearables.AgentData.SerialNum,
                    attachments: []
                };
                wearables.WearableData.forEach((wearable) =>
                {
                    if (this.wearables && this.wearables.attachments)
                    {
                        this.wearables.attachments.push({
                            itemID: wearable.ItemID,
                            assetID: wearable.AssetID,
                            wearableType: wearable.WearableType
                        });
                    }
                });
            }

            Object.keys(this.inventory.main.skeleton).forEach((uuid) =>
            {
                const folder = this.inventory.main.skeleton[uuid];
                if (folder.typeDefault === AssetType.CurrentOutfitFolder)
                {
                    const folderID = folder.folderID;

                    const requestFolder = {
                        folder_id: new LLSD.UUID(folderID),
                        owner_id: new LLSD.UUID(this.agentID),
                        fetch_folders: true,
                        fetch_items: true,
                        sort_order: InventorySortOrder.ByName
                    };
                    const requestedFolders = {
                        'folders': [
                            requestFolder
                        ]
                    };
                    this.currentRegion.caps.capsRequestXML('FetchInventoryDescendents2', requestedFolders).then((folderContents: any) =>
                    {
                        const currentOutfitFolderContents = folderContents['folders'][0]['items'];
                        const wornObjects = this.currentRegion.objects.getObjectsByParent(this.localID);
                        currentOutfitFolderContents.forEach((item: any) =>
                        {
                            if (item.type === 6)
                            {
                                let found = false;
                                wornObjects.forEach((obj: GameObject) =>
                                {
                                    if (obj.hasNameValueEntry('AttachItemID'))
                                    {
                                        if (item['item_id'].toString() === obj.getNameValueEntry('AttachItemID'))
                                        {
                                            found = true;
                                        }
                                    }
                                });

                                if (!found)
                                {
                                    const rsafi = new RezSingleAttachmentFromInvMessage();
                                    rsafi.AgentData = {
                                        AgentID: this.agentID,
                                        SessionID: circuit.sessionID
                                    };
                                    rsafi.ObjectData = {
                                        ItemID: new UUID(item['item_id'].toString()),
                                        OwnerID: this.agentID,
                                        AttachmentPt: 0x80 | AttachmentPoint.Default,
                                        ItemFlags: item['flags'],
                                        GroupMask: item['permissions']['group_mask'],
                                        EveryoneMask: item['permissions']['everyone_mask'],
                                        NextOwnerMask: item['permissions']['next_owner_mask'],
                                        Name: Utils.StringToBuffer(item['name']),
                                        Description: Utils.StringToBuffer(item['desc'])
                                    };
                                    circuit.sendMessage(rsafi, PacketFlags.Reliable);
                                }
                            }
                        });
                    });

                }
            });
        });
    }
}
