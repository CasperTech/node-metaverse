import {UUID} from './UUID';
import {Vector3} from './Vector3';
import {Inventory} from './Inventory';
import Long = require('long');
import {Wearable} from './Wearable';
import {ControlFlags} from '../enums/ControlFlags';
import {Region} from './Region';
import {Message} from '../enums/Message';
import {Packet} from './Packet';
import {AvatarAnimationMessage} from './messages/AvatarAnimation';
import {AgentUpdateMessage} from './messages/AgentUpdate';
import {Quaternion} from './Quaternion';
import {AgentState} from '../enums/AgentState';
import {AgentFlags} from '../enums/AgentFlags';
import {BuiltInAnimations} from '../enums/BuiltInAnimations';
import * as LLSD from 'llsd';
import {AssetType} from '../enums/AssetType';
import {AgentWearablesRequestMessage} from './messages/AgentWearablesRequest';
import {PacketFlags} from '../enums/PacketFlags';
import {AgentWearablesUpdateMessage} from './messages/AgentWearablesUpdate';
import {InventorySortOrder} from '../enums/InventorySortOrder';
import {RezSingleAttachmentFromInvMessage} from './messages/RezSingleAttachmentFromInv';
import {AttachmentPoint} from '../enums/AttachmentPoint';
import {Utils} from './Utils';
import {AgentAnimationMessage} from './messages/AgentAnimation';
import {ClientEvents} from './ClientEvents';
import {IGameObject} from './interfaces/IGameObject';

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
    lookAt: Vector3;
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
    agentUpdateTimer: number | null = null;
    private clientEvents: ClientEvents;

    constructor(clientEvents: ClientEvents)
    {
        this.inventory = new Inventory(clientEvents);
        this.clientEvents = clientEvents;
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
            CameraCenter: new Vector3([199.58, 203.95, 24.304]),
            CameraAtAxis: new Vector3([0.979546, 0.105575, -0.171303]),
            CameraLeftAxis: new Vector3([-0.107158, 0.994242, 0]),
            CameraUpAxis: new Vector3([0.170316, 0.018357, 0.985218]),
            Far: 128,
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
                        console.log('Stopping animation ' + a);
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
        circuit.waitForMessage(Message.AgentWearablesUpdate, 10000).then((packet: Packet) =>
        {
            const wearables = packet.message as AgentWearablesUpdateMessage;
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

            this.inventory.main.skeleton.forEach((folder) =>
            {
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
                                wornObjects.forEach((obj: IGameObject) =>
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
