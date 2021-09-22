import { Vector3 } from '../Vector3';
import { UUID } from '../UUID';
import { Quaternion } from '../Quaternion';
import { Tree } from '../../enums/Tree';
import { Vector4 } from '../Vector4';
import { TextureEntry } from '../TextureEntry';
import { Color4 } from '../Color4';
import { ParticleSystem } from '../ParticleSystem';
import { ITreeBoundingBox } from '../interfaces/ITreeBoundingBox';
import { NameValue } from '../NameValue';
import * as Long from 'long';
import { IGameObjectData } from '../interfaces/IGameObjectData';
import * as builder from 'xmlbuilder';
import { XMLElement, XMLNode } from 'xmlbuilder';
import { Region } from '../Region';
import { InventoryItem } from '../InventoryItem';
import { LLWearable } from '../LLWearable';
import { TextureAnim } from './TextureAnim';
import { ExtraParams } from './ExtraParams';
import { ObjectExtraParamsMessage } from '../messages/ObjectExtraParams';
import { ExtraParamType } from '../../enums/ExtraParamType';
import { ObjectImageMessage } from '../messages/ObjectImage';
import { ObjectNameMessage } from '../messages/ObjectName';
import { ObjectDescriptionMessage } from '../messages/ObjectDescription';
import { MultipleObjectUpdateMessage } from '../messages/MultipleObjectUpdate';
import { UpdateType } from '../../enums/UpdateType';
import { ObjectLinkMessage } from '../messages/ObjectLink';
import { ObjectShapeMessage } from '../messages/ObjectShape';
import { PrimFlags } from '../../enums/PrimFlags';
import { Utils } from '../Utils';
import { ProfileShape } from '../../enums/ProfileShape';
import { HoleType } from '../../enums/HoleType';
import { SculptType } from '../../enums/SculptType';
import { PacketFlags } from '../../enums/PacketFlags';
import { HTTPAssets } from '../../enums/HTTPAssets';
import { PhysicsShapeType } from '../../enums/PhysicsShapeType';
import { PCode } from '../../enums/PCode';
import { SoundFlags } from '../../enums/SoundFlags';
import { DeRezObjectMessage } from '../messages/DeRezObject';
import { DeRezDestination } from '../../enums/DeRezDestination';
import { Message } from '../../enums/Message';
import { UpdateCreateInventoryItemMessage } from '../messages/UpdateCreateInventoryItem';
import { FilterResponse } from '../../enums/FilterResponse';
import { UpdateTaskInventoryMessage } from '../messages/UpdateTaskInventory';
import { ObjectPropertiesMessage } from '../messages/ObjectProperties';
import { ObjectSelectMessage } from '../messages/ObjectSelect';
import { ObjectDeselectMessage } from '../messages/ObjectDeselect';
import { AttachmentPoint } from '../../enums/AttachmentPoint';
import { RequestTaskInventoryMessage } from '../messages/RequestTaskInventory';
import { ReplyTaskInventoryMessage } from '../messages/ReplyTaskInventory';
import { InventoryType } from '../../enums/InventoryType';
import { InventoryFolder } from '../InventoryFolder';
import { ObjectUpdateMessage } from '../messages/ObjectUpdate';
import { Subject } from 'rxjs';
import { RezScriptMessage } from '../messages/RezScript';
import { PermissionMask } from '../../enums/PermissionMask';
import { AssetType } from '../../enums/AssetType';

import * as uuid from 'uuid';

export class GameObject implements IGameObjectData
{
    rtreeEntry?: ITreeBoundingBox;

    textureAnim: TextureAnim;
    extraParams: ExtraParams;

    deleted = false;
    creatorID?: UUID;
    creationDate?: Long;
    baseMask?: number;
    ownerMask?: number;
    groupMask?: number;
    groupID?: UUID;
    everyoneMask?: number;
    nextOwnerMask?: number;
    ownershipCost?: number;
    saleType?: number;
    salePrice?: number;
    aggregatePerms?: number;
    aggregatePermTextures?: number;
    aggregatePermTexturesOwner?: number;
    category: number;
    inventorySerial: number;
    itemID: UUID;
    folderID: UUID;
    fromTaskID: UUID;
    lastOwnerID: UUID;
    name?: string;
    description?: string;
    touchName?: string;
    sitName?: string;
    textureID?: string;
    resolvedAt?: number;
    resolvedInventory = false;
    totalChildren?: number;

    landImpact?: number;
    calculatedLandImpact?: number;
    physicaImpact?: number;
    resourceImpact?: number;
    linkResourceImpact?: number;
    linkPhysicsImpact?: number;
    limitingType?: string;

    children?: GameObject[];
    ID = 0;
    FullID = UUID.random();
    ParentID?: number;
    OwnerID = UUID.zero();
    IsAttachment = false;
    NameValue: {[key: string]: NameValue} = {};
    PCode: PCode = PCode.None;

    State?: number;
    CRC?: number;
    Material?: number;
    ClickAction?: number;
    Scale?: Vector3;
    Flags?: PrimFlags;
    PathCurve?: number;
    ProfileCurve?: number;
    PathBegin?: number;
    PathEnd?: number;
    PathScaleX?: number;
    PathScaleY?: number;
    PathShearX?: number;
    PathShearY?: number;
    PathTwist?: number;
    PathTwistBegin?: number;
    PathRadiusOffset?: number;
    PathTaperX?: number;
    PathTaperY?: number;
    PathRevolutions?: number;
    PathSkew?: number;
    ProfileBegin?: number;
    ProfileEnd?: number;
    ProfileHollow?: number;
    TextureEntry?: TextureEntry;
    Text?: string;
    TextColor?: Color4;
    MediaURL?: string;
    JointType?: number;
    JointPivot?: Vector3;
    JointAxisOrAnchor?: Vector3;
    Position?: Vector3;
    Rotation?: Quaternion;
    CollisionPlane?: Vector4;
    Velocity?: Vector3;
    Acceleration?: Vector3;
    AngularVelocity?: Vector3;
    TreeSpecies?: Tree;
    Sound?: UUID;
    SoundGain?: number;
    SoundFlags?: SoundFlags;
    SoundRadius?: number;
    Particles?: ParticleSystem;

    density?: number;
    friction?: number;
    gravityMultiplier?: number;
    physicsShapeType?: PhysicsShapeType;
    restitution?: number;
    attachmentPoint: AttachmentPoint = AttachmentPoint.Default;

    region: Region;

    inventory: InventoryItem[] = [];

    resolveAttempts = 0;

    claimedForBuild = false;
    createdSelected = false;
    isMarkedRoot = false;
    onTextureUpdate: Subject<void> = new Subject<void>();

    private static partFromXMLJS(obj: any, isRoot: boolean): GameObject
    {
        const go = new GameObject();
        go.Flags = 0;
        let prop: any;
        if (Utils.getFromXMLJS(obj, 'AllowedDrop') !== undefined)
        {
            go.Flags = go.Flags | PrimFlags.AllowInventoryDrop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'CreatorID')) !== undefined)
        {
            go.creatorID = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'FolderID')) !== undefined)
        {
            go.folderID = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'InventorySerial')) !== undefined)
        {
            go.inventorySerial = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'UUID')) !== undefined)
        {
            go.FullID = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'LocalId')) !== undefined)
        {
            go.ID = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'Name')) !== undefined)
        {
            go.name = String(prop);
        }
        if ((prop = Utils.getFromXMLJS(obj, 'Material')) !== undefined)
        {
            go.Material = prop;
        }
        if ((prop = Vector3.fromXMLJS(obj, 'GroupPosition')) !== undefined)
        {
            if (isRoot)
            {
                go.Position = prop;
            }
        }
        if ((prop = Vector3.fromXMLJS(obj, 'OffsetPosition')) !== undefined)
        {
            if (!isRoot)
            {
                go.Position = prop;
            }
        }
        if ((prop = Quaternion.fromXMLJS(obj, 'RotationOffset')) !== undefined)
        {
            go.Rotation = prop;
        }
        if ((prop = Vector3.fromXMLJS(obj, 'Velocity')) !== undefined)
        {
            go.Velocity = prop;
        }
        if ((prop = Vector3.fromXMLJS(obj, 'AngularVelocity')) !== undefined)
        {
            go.AngularVelocity = prop;
        }
        if ((prop = Vector3.fromXMLJS(obj, 'Acceleration')) !== undefined)
        {
            go.Acceleration = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'Description')) !== undefined)
        {
            go.description = String(prop);
        }
        if ((prop = Utils.getFromXMLJS(obj, 'Text')) !== undefined)
        {
            go.Text = String(prop);
        }
        if ((prop = Color4.fromXMLJS(obj, 'Color')) !== undefined)
        {
            go.TextColor = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'SitName')) !== undefined)
        {
            go.sitName = String(prop);
        }
        if ((prop = Utils.getFromXMLJS(obj, 'TouchName')) !== undefined)
        {
            go.touchName = String(prop);
        }
        if ((prop = Utils.getFromXMLJS(obj, 'ClickAction')) !== undefined)
        {
            go.ClickAction = prop;
        }
        if ((prop = Vector3.fromXMLJS(obj, 'Scale')) !== undefined)
        {
            go.Scale = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'ParentID')) !== undefined)
        {
            go.ParentID = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'Category')) !== undefined)
        {
            go.category = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'SalePrice')) !== undefined)
        {
            go.salePrice = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'ObjectSaleType')) !== undefined)
        {
            go.saleType = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'OwnershipCost')) !== undefined)
        {
            go.ownershipCost = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'GroupID')) !== undefined)
        {
            go.groupID = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'OwnerID')) !== undefined)
        {
            go.OwnerID = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'LastOwnerID')) !== undefined)
        {
            go.lastOwnerID = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'BaseMask')) !== undefined)
        {
            go.baseMask = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'OwnerMask')) !== undefined)
        {
            go.ownerMask = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'GroupMask')) !== undefined)
        {
            go.groupMask = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'EveryoneMask')) !== undefined)
        {
            go.everyoneMask = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'NextOwnerMask')) !== undefined)
        {
            go.nextOwnerMask = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'Flags')) !== undefined)
        {
            let flags = 0;
            if (typeof prop === 'string')
            {
                const flagList = prop.split(' ');
                for (const flag of flagList)
                {
                    const f: any = String(flag);
                    if (PrimFlags[f])
                    {
                        flags = flags | parseInt(PrimFlags[f], 10);
                    }
                }
            }
            go.Flags = flags;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'TextureAnimation')) !== undefined)
        {
            const buf = Buffer.from(prop, 'base64');
            go.textureAnim = TextureAnim.from(buf);
        }
        if ((prop = Utils.getFromXMLJS(obj, 'ParticleSystem')) !== undefined)
        {
            const buf = Buffer.from(prop, 'base64');
            go.Particles = ParticleSystem.from(buf);
        }
        if ((prop = Utils.getFromXMLJS(obj, 'PhysicsShapeType')) !== undefined)
        {
            go.physicsShapeType = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'SoundID')) !== undefined)
        {
            go.Sound = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'SoundGain')) !== undefined)
        {
            go.SoundGain = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'SoundFlags')) !== undefined)
        {
            go.SoundFlags = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'SoundRadius')) !== undefined)
        {
            go.SoundRadius = prop;
        }
        if ((prop = Utils.getFromXMLJS(obj, 'Shape')) !== undefined)
        {
            const shape = prop;
            if ((prop = Utils.getFromXMLJS(shape, 'ProfileCurve')) !== undefined)
            {
                go.ProfileCurve = prop;
            }
            if ((prop = Utils.getFromXMLJS(shape, 'TextureEntry')) !== undefined)
            {
                const buf = Buffer.from(prop, 'base64');
                go.TextureEntry = TextureEntry.from(buf);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathBegin')) !== undefined)
            {
                go.PathBegin = Utils.unpackBeginCut(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathCurve')) !== undefined)
            {
                go.PathCurve = prop;
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathEnd')) !== undefined)
            {
                go.PathEnd = Utils.unpackEndCut(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathRadiusOffset')) !== undefined)
            {
                go.PathRadiusOffset = Utils.unpackPathTwist(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathRevolutions')) !== undefined)
            {
                go.PathRevolutions = Utils.unpackPathRevolutions(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathScaleX')) !== undefined)
            {
                go.PathScaleX = Utils.unpackPathScale(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathScaleY')) !== undefined)
            {
                go.PathScaleY = Utils.unpackPathScale(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathShearX')) !== undefined)
            {
                go.PathShearX = Utils.unpackPathShear(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathShearY')) !== undefined)
            {
                go.PathShearY = Utils.unpackPathShear(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathSkew')) !== undefined)
            {
                go.PathSkew = Utils.unpackPathShear(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathTaperX')) !== undefined)
            {
                go.PathTaperX = Utils.unpackPathTaper(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathTaperY')) !== undefined)
            {
                go.PathTaperY = Utils.unpackPathTaper(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathTwist')) !== undefined)
            {
                go.PathTwist = Utils.unpackPathTwist(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PathTwistBegin')) !== undefined)
            {
                go.PathTwistBegin = Utils.unpackPathTwist(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'PCode')) !== undefined)
            {
                go.PCode = prop;
            }
            if ((prop = Utils.getFromXMLJS(shape, 'ProfileBegin')) !== undefined)
            {
                go.ProfileBegin = Utils.unpackBeginCut(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'ProfileEnd')) !== undefined)
            {
                go.ProfileEnd = Utils.unpackEndCut(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'ProfileHollow')) !== undefined)
            {
                go.ProfileHollow = Utils.unpackProfileHollow(prop);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'State')) !== undefined)
            {
                go.attachmentPoint = parseInt(prop, 10);
                const mask = 0xf << 4 >>> 0;
                go.State = (((prop & mask) >>> 4) | ((prop & ~mask) << 4)) >>> 0;
            }
            if ((prop = Utils.getFromXMLJS(shape, 'ProfileShape')) !== undefined)
            {
                if (!go.ProfileCurve)
                {
                    go.ProfileCurve = 0;
                }
                go.ProfileCurve = go.ProfileCurve | parseInt(ProfileShape[prop], 10);
            }
            if ((prop = Utils.getFromXMLJS(shape, 'HollowShape')) !== undefined)
            {
                if (!go.ProfileCurve)
                {
                    go.ProfileCurve = 0;
                }
                go.ProfileCurve = go.ProfileCurve | parseInt(HoleType[prop], 10);
            }
            if (Utils.getFromXMLJS(shape, 'SculptEntry') !== undefined)
            {
                const type = Utils.getFromXMLJS(shape, 'SculptType');
                if (type !== false && type !== undefined)
                {
                    const id = UUID.fromXMLJS(shape, 'SculptTexture');
                    if (id instanceof UUID)
                    {
                        if (!go.extraParams)
                        {
                            go.extraParams = new ExtraParams();
                        }
                        if (type & SculptType.Mesh)
                        {
                            go.extraParams.setMeshData(type, id);
                        }
                        else
                        {
                            go.extraParams.setSculptData(type, id);
                        }
                    }
                }
            }
            if (Utils.getFromXMLJS(shape, 'FlexiEntry') !== undefined)
            {
                const flexiSoftness = Utils.getFromXMLJS(shape, 'FlexiSoftness');
                const flexiTension = Utils.getFromXMLJS(shape, 'FlexiTension');
                const flexiDrag = Utils.getFromXMLJS(shape, 'FlexiDrag');
                const flexiGravity = Utils.getFromXMLJS(shape, 'FlexiGravity');
                const flexiWind = Utils.getFromXMLJS(shape, 'FlexiWind');
                const flexiForceX = Utils.getFromXMLJS(shape, 'FlexiForceX');
                const flexiForceY = Utils.getFromXMLJS(shape, 'FlexiForceY');
                const flexiForceZ = Utils.getFromXMLJS(shape, 'FlexiForceZ');
                if (flexiSoftness !== false &&
                    flexiTension !== false &&
                    flexiDrag && false &&
                    flexiGravity !== false &&
                    flexiWind !== false &&
                    flexiForceX !== false &&
                    flexiForceY !== false &&
                    flexiForceZ !== false)
                {
                    if (!go.extraParams)
                    {
                        go.extraParams = new ExtraParams();
                    }
                    go.extraParams.setFlexiData(flexiSoftness, flexiTension, flexiDrag, flexiGravity, flexiWind, new Vector3([flexiForceX, flexiForceY, flexiForceZ]));
                }
            }
            if (Utils.getFromXMLJS(shape, 'LightEntry') !== undefined)
            {
                const lightColorR = Utils.getFromXMLJS(shape, 'LightColorR');
                const lightColorG = Utils.getFromXMLJS(shape, 'LightColorG');
                const lightColorB = Utils.getFromXMLJS(shape, 'LightColorB');
                const lightColorA = Utils.getFromXMLJS(shape, 'LightColorA');
                const lightRadius = Utils.getFromXMLJS(shape, 'LightRadius');
                const lightCutoff = Utils.getFromXMLJS(shape, 'LightCutoff');
                const lightFalloff = Utils.getFromXMLJS(shape, 'LightFalloff');
                const lightIntensity = Utils.getFromXMLJS(shape, 'LightIntensity');
                if (lightColorR !== false &&
                    lightColorG !== false &&
                    lightColorB !== false &&
                    lightColorA !== false &&
                    lightRadius !== false &&
                    lightCutoff !== false &&
                    lightFalloff !== false &&
                    lightIntensity !== false)
                {
                    if (!go.extraParams)
                    {
                        go.extraParams = new ExtraParams();
                    }
                    go.extraParams.setLightData(
                        new Color4(lightColorR, lightColorG, lightColorB, lightColorA),
                        lightRadius,
                        lightCutoff,
                        lightFalloff,
                        lightIntensity
                    );
                }
            }
            if ((prop = Utils.getFromXMLJS(shape, 'ExtraParams')) !== undefined)
            {
                const buf = Buffer.from(prop, 'base64');
                go.extraParams = ExtraParams.from(buf);
            }
        }
        if ((prop = Utils.getFromXMLJS(obj, 'TaskInventory')) !== undefined)
        {
            if (prop.TaskInventoryItem)
            {
                for (const invItemXML of prop.TaskInventoryItem)
                {
                    const invItem = new InventoryItem(go);
                    let subProp: any;
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'AssetID')) !== undefined)
                    {
                        invItem.assetID = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'BasePermissions')) !== undefined)
                    {
                        invItem.permissions.baseMask = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'EveryonePermissions')) !== undefined)
                    {
                        invItem.permissions.everyoneMask = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'GroupPermissions')) !== undefined)
                    {
                        invItem.permissions.groupMask = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'NextPermissions')) !== undefined)
                    {
                        invItem.permissions.nextOwnerMask = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'CurrentPermissions')) !== undefined)
                    {
                        invItem.permissions.ownerMask = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'CreationDate')) !== undefined)
                    {
                        invItem.created = new Date(parseInt(subProp, 10) * 1000);
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'CreatorID')) !== undefined)
                    {
                        invItem.permissions.creator = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'Description')) !== undefined)
                    {
                        invItem.description = String(subProp);
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'Flags')) !== undefined)
                    {
                        invItem.flags = subProp;
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'GroupID')) !== undefined)
                    {
                        invItem.permissions.group = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'InvType')) !== undefined)
                    {
                        invItem.inventoryType = subProp;
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'ItemID')) !== undefined)
                    {
                        invItem.itemID = subProp;
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'OldItemID')) !== undefined)
                    {
                        invItem.oldItemID = subProp;
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'LastOwnerID')) !== undefined)
                    {
                        invItem.permissions.lastOwner = subProp;
                    }
                    if ((subProp = Utils.getFromXMLJS(invItemXML, 'Name')) !== undefined)
                    {
                        invItem.name = String(subProp);
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'OwnerID')) !== undefined)
                    {
                        invItem.permissions.owner = subProp;
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'ParentID')) !== undefined)
                    {
                        invItem.parentID = subProp;
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'ParentPartID')) !== undefined)
                    {
                        invItem.parentPartID = subProp;
                    }
                    if ((subProp = UUID.fromXMLJS(invItemXML, 'PermsGranter')) !== undefined)
                    {
                        invItem.permsGranter = subProp;
                    }
                    go.inventory.push(invItem);
                }
            }
        }
        return go;
    }

    static async fromXML(xml: string | any): Promise<GameObject>
    {
        let result;
        if (typeof xml === 'string')
        {
            const parsed = await Utils.parseXML(xml);
            if (!parsed['SceneObjectGroup'])
            {
                throw new Error('SceneObjectGroup not found');
            }
            result = parsed['SceneObjectGroup'];
        }
        else
        {
            result = xml;
        }

        let rootPartXML;
        if (result['SceneObjectPart'])
        {
            rootPartXML = result['SceneObjectPart'];
        }
        else if (result['RootPart'] && result['RootPart'][0] && result['RootPart'][0]['SceneObjectPart'])
        {
            rootPartXML = result['RootPart'][0]['SceneObjectPart'];
        }
        else
        {
            throw new Error('Root part not found');
        }

        const rootPart = GameObject.partFromXMLJS(rootPartXML[0], true);
        rootPart.children = [];
        rootPart.totalChildren = 0;
        if (result['OtherParts'] && Array.isArray(result['OtherParts']) && result['OtherParts'].length > 0)
        {
            const obj = result['OtherParts'][0];
            if (obj['SceneObjectPart'] || obj['Part'])
            {
                if (obj['Part'])
                {
                    for (const part of obj['Part'])
                    {
                        rootPart.children.push(GameObject.partFromXMLJS(part['SceneObjectPart'][0], false));
                        rootPart.totalChildren++;
                    }
                }
                else
                {
                    for (const part of obj['SceneObjectPart'])
                    {
                        rootPart.children.push(GameObject.partFromXMLJS(part, false));
                        rootPart.totalChildren++;
                    }
                }
            }
        }
        return rootPart;
    }

    static async deRezObjects(region: Region, objects: GameObject[], destination: DeRezDestination, transactionID: UUID, destFolder: UUID): Promise<void>
    {
        const msg = new DeRezObjectMessage();

        msg.AgentData = {
            AgentID: region.agent.agentID,
            SessionID: region.circuit.sessionID
        };
        msg.AgentBlock = {
            GroupID: UUID.zero(),
            Destination: destination,
            DestinationID: destFolder,
            TransactionID: transactionID,
            PacketCount: 1,
            PacketNumber: 1
        };
        msg.ObjectData = [];
        for (const obj of objects)
        {
            msg.ObjectData.push({
                ObjectLocalID: obj.ID
            });
        }
        const ack = region.circuit.sendMessage(msg, PacketFlags.Reliable);
        return region.circuit.waitForAck(ack, 10000);
    }

    static takeManyToInventory(region: Region, objects: GameObject[], folder?: InventoryFolder): Promise<InventoryItem>
    {
        const transactionID = UUID.random();
        let enforceFolder = true;
        if (folder === undefined)
        {
            enforceFolder = false;
            folder = region.agent.inventory.getRootFolderMain();
        }
        return new Promise<InventoryItem>((resolve, reject) =>
        {

            region.circuit.waitForMessage<UpdateCreateInventoryItemMessage>(Message.UpdateCreateInventoryItem, 10000, (message: UpdateCreateInventoryItemMessage) =>
            {
                for (const inv of message.InventoryData)
                {
                    const name = Utils.BufferToStringSimple(inv.Name);
                    if (name === objects[0].name)
                    {
                        return FilterResponse.Finish;
                    }
                }
                return FilterResponse.NoMatch;
            }).then((createInventoryMsg: UpdateCreateInventoryItemMessage) =>
            {
                for (const inv of createInventoryMsg.InventoryData)
                {
                    const name = Utils.BufferToStringSimple(inv.Name);
                    if (name === objects[0].name)
                    {
                        const itemID = inv.ItemID;
                        region.agent.inventory.fetchInventoryItem(itemID).then((item: InventoryItem | null) =>
                        {
                            if (item === null)
                            {
                                reject(new Error('Inventory item was unable to be retrieved after take to inventory'));
                            }
                            else
                            {
                                if (enforceFolder && folder !== undefined && !item.parentID.equals(folder.folderID))
                                {
                                    item.moveToFolder(folder).then(() =>
                                    {
                                        resolve(item);
                                    }).catch((err: Error) =>
                                    {
                                        console.error('Error moving item to correct folder');
                                        console.error(err);
                                        resolve(item);
                                    });
                                }
                                else
                                {
                                    resolve(item);
                                }
                            }
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                        return;
                    }
                }
            }).catch(() =>
            {
                reject(new Error('Timed out waiting for UpdateCreateInventoryItem'));
            });
            if (folder !== undefined)
            {
                GameObject.deRezObjects(region, objects, DeRezDestination.AgentInventoryTake, transactionID, folder.folderID).then(() =>
                {
                }).catch((err) =>
                {
                    console.error(err);
                });
            }
        });
    }

    constructor()
    {
        this.Position = Vector3.getZero();
        this.Rotation = Quaternion.getIdentity();
        this.AngularVelocity = Vector3.getZero();
        this.TreeSpecies = 0;
        this.SoundFlags = 0;
        this.SoundRadius = 1.0;
        this.SoundGain = 1.0;
    }

    async waitForTextureUpdate(timeout?: number): Promise<void>
    {
        return Utils.waitOrTimeOut<void>(this.onTextureUpdate, timeout);
    }

    async rezScript(name: string, description: string, perms: PermissionMask = 532480): Promise<InventoryItem>
    {
        const rezScriptMsg = new RezScriptMessage();
        rezScriptMsg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID,
            GroupID: this.region.agent.activeGroupID
        };
        rezScriptMsg.UpdateBlock = {
            ObjectLocalID: this.ID,
            Enabled: true
        };
        const tmpName = uuid.v4();
        const invItem = new InventoryItem(this);
        invItem.itemID = UUID.zero();
        invItem.parentID = this.FullID;
        invItem.permissions.creator = this.region.agent.agentID;
        invItem.permissions.group = UUID.zero();
        invItem.permissions.baseMask = PermissionMask.All;
        invItem.permissions.ownerMask = PermissionMask.All;
        invItem.permissions.groupMask = 0;
        invItem.permissions.everyoneMask = 0;
        invItem.permissions.nextOwnerMask = perms;
        invItem.permissions.groupOwned = false;
        invItem.type = AssetType.LSLText;
        invItem.inventoryType = InventoryType.LSL;
        invItem.flags = 0;
        invItem.salePrice = this.salePrice || 10;
        invItem.saleType = this.saleType || 0;
        invItem.name = tmpName;
        invItem.description = description;
        invItem.created = new Date();

        rezScriptMsg.InventoryBlock = {
            ItemID: UUID.zero(),
            FolderID: this.FullID,
            CreatorID: this.region.agent.agentID,
            OwnerID: this.region.agent.agentID,
            GroupID: UUID.zero(),
            BaseMask: PermissionMask.All,
            OwnerMask: PermissionMask.All,
            GroupMask: 0,
            EveryoneMask: 0,
            NextOwnerMask: perms,
            GroupOwned: false,
            TransactionID: UUID.zero(),
            Type: AssetType.LSLText,
            InvType: InventoryType.LSL,
            Flags: 0,
            SaleType: this.saleType || 0,
            SalePrice: this.salePrice || 10,
            Name: Utils.StringToBuffer(tmpName),
            Description: Utils.StringToBuffer(description),
            CreationDate: Math.floor(invItem.created.getTime() / 1000),
            CRC: invItem.getCRC()
        };
        await this.region.circuit.waitForAck(this.region.circuit.sendMessage(rezScriptMsg, PacketFlags.Reliable), 10000);
        await this.updateInventory();
        for (const item of this.inventory)
        {
            if (item.name === tmpName)
            {
                item.renameInTask(this, name).then(() => {}).catch(() => {});
                await this.waitForInventoryUpdate();
                await this.updateInventory();
                for (const newItem of this.inventory)
                {
                    if (newItem.itemID.equals(item.itemID))
                    {
                        return newItem;
                    }
                }
                return item;
            }
        }
        throw new Error('Failed to add script to object');
    }

    updateInventory(): Promise<void>
    {
        const req = new RequestTaskInventoryMessage();
        req.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        req.InventoryData = {
            LocalID: this.ID
        };
        this.region.circuit.sendMessage(req, PacketFlags.Reliable);
        return this.waitForTaskInventory();
    }

    private async waitForTaskInventory(): Promise<void>
    {
        const inventory = await this.region.circuit.waitForMessage<ReplyTaskInventoryMessage>(Message.ReplyTaskInventory, 10000, (message: ReplyTaskInventoryMessage): FilterResponse =>
        {
            if (message.InventoryData.TaskID.equals(this.FullID))
            {
                return FilterResponse.Finish;
            }
            else
            {
                return FilterResponse.Match;
            }
        });
        const fileName = Utils.BufferToStringSimple(inventory.InventoryData.Filename);

        const file = await this.region.circuit.XferFileDown(fileName, true, false, UUID.zero(), AssetType.Unknown, true);
        this.inventory = [];
        if (file.length === 0)
        {
            if (this.Flags === undefined)
            {
                this.Flags = 0;
            }
            this.Flags = this.Flags | PrimFlags.InventoryEmpty;
        }
        else
        {
            const str = file.toString('utf-8');
            const lineObj =  {
                lines: str.replace(/\r\n/g, '\n').split('\n'),
                lineNum: 0
            };
            while (lineObj.lineNum < lineObj.lines.length)
            {
                const line = lineObj.lines[lineObj.lineNum++];
                const result = Utils.parseLine(line);
                if (result.key !== null)
                {
                    switch (result.key)
                    {
                        case 'inv_object':
                            /*
                            let itemID = UUID.zero();
                            let parentID = UUID.zero();
                            let name = '';
                            let assetType: AssetType = AssetType.Unknown;

                            while (lineObj.lineNum < lineObj.lines.length)
                            {
                                result = Utils.parseLine(lineObj.lines[lineObj.lineNum++]);
                                if (result.key !== null)
                                {
                                    if (result.key === '{')
                                    {
                                        // do nothing
                                    }
                                    else if (result.key === '}')
                                    {
                                        break;
                                    }
                                    else if (result.key === 'obj_id')
                                    {
                                        itemID = new UUID(result.value);
                                    }
                                    else if (result.key === 'parent_id')
                                    {
                                        parentID = new UUID(result.value);
                                    }
                                    else if (result.key === 'type')
                                    {
                                        const typeString = result.value as any;
                                        assetType = parseInt(AssetTypeLL[typeString], 10);
                                    }
                                    else if (result.key === 'name')
                                    {
                                        name = result.value.substr(0, result.value.indexOf('|'));
                                    }
                                }
                            }

                            if (name !== 'Contents')
                            {
                                console.log('TODO: Do something useful with inv_objects')
                            }
                            */
                            break;
                        case 'inv_item':
                            this.inventory.push(InventoryItem.fromAsset(lineObj, this, this.region.agent));
                            break;
                    }
                }
            }
        }
    }

    hasNameValueEntry(key: string): boolean
    {
        return this.NameValue[key] !== undefined;
    }

    getNameValueEntry(key: string): string
    {
        if (this.NameValue[key])
        {
            return this.NameValue[key].value;
        }
        return '';
    }

    setIfDefined(def?: number, v?: number): number
    {
        if (def === undefined)
        {
            def = 0;
        }
        if (v === undefined)
        {
            return def;
        }
        else
        {
            return v;
        }
    }

    async setShape(PathCurve?: number,
                   ProfileCurve?: number,
                   PathBegin?: number,
                   PathEnd?: number,
                   PathScaleX?: number,
                   PathScaleY?: number,
                   PathShearX?: number,
                   PathShearY?: number,
                   PathTwist?: number,
                   PathTwistBegin?: number,
                   PathRadiusOffset?: number,
                   PathTaperX?: number,
                   PathTaperY?: number,
                   PathRevolutions?: number,
                   PathSkew?: number,
                   ProfileBegin?: number,
                   ProfileEnd?: number,
                   ProfileHollow?: number): Promise<void>
    {
        this.PathCurve = this.setIfDefined(this.PathCurve, PathCurve);
        this.ProfileCurve = this.setIfDefined(this.ProfileCurve, ProfileCurve);
        this.PathBegin = this.setIfDefined(this.PathBegin, PathBegin);
        this.PathEnd = this.setIfDefined(this.PathEnd, PathEnd);
        this.PathScaleX = this.setIfDefined(this.PathScaleX, PathScaleX);
        this.PathScaleY = this.setIfDefined(this.PathScaleY, PathScaleY);
        this.PathShearX = this.setIfDefined(this.PathShearX, PathShearX);
        this.PathShearY = this.setIfDefined(this.PathShearY, PathShearY);
        this.PathTwist = this.setIfDefined(this.PathTwist, PathTwist);
        this.PathTwistBegin = this.setIfDefined(this.PathTwistBegin, PathTwistBegin);
        this.PathRadiusOffset = this.setIfDefined(this.PathRadiusOffset, PathRadiusOffset);
        this.PathTaperX = this.setIfDefined(this.PathTaperX, PathTaperX);
        this.PathTaperY = this.setIfDefined(this.PathTaperY, PathTaperY);
        this.PathRevolutions = this.setIfDefined(this.PathRevolutions, PathRevolutions);
        this.PathSkew = this.setIfDefined(this.PathSkew, PathSkew);
        this.ProfileBegin = this.setIfDefined(this.ProfileBegin, ProfileBegin);
        this.ProfileEnd = this.setIfDefined(this.ProfileEnd, ProfileEnd);
        this.ProfileHollow = this.setIfDefined(this.ProfileHollow, ProfileHollow);
        if (!this.region)
        {
            return;
        }
        const msg = new ObjectShapeMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        msg.ObjectData = [
            {
                ObjectLocalID: this.ID,
                PathCurve: this.PathCurve,
                ProfileCurve: this.ProfileCurve,
                PathBegin: Utils.packBeginCut(this.PathBegin),
                PathEnd: Utils.packEndCut(this.PathEnd),
                PathScaleX: Utils.packPathScale(this.PathScaleX),
                PathScaleY: Utils.packPathScale(this.PathScaleY),
                PathShearX: Utils.packPathShear(this.PathShearX),
                PathShearY: Utils.packPathShear(this.PathShearY),
                PathTwist: Utils.packPathTwist(this.PathTwist),
                PathTwistBegin: Utils.packPathTwist(this.PathTwistBegin),
                PathRadiusOffset: Utils.packPathTwist(this.PathRadiusOffset),
                PathTaperX: Utils.packPathTaper(this.PathTaperX),
                PathTaperY: Utils.packPathTaper(this.PathTaperY),
                PathRevolutions: Utils.packPathRevolutions(this.PathRevolutions),
                PathSkew: Utils.packPathTwist(this.PathSkew),
                ProfileBegin: Utils.packBeginCut(this.ProfileBegin),
                ProfileEnd: Utils.packEndCut(this.ProfileEnd),
                ProfileHollow: Utils.packProfileHollow(this.ProfileHollow)
            }
        ];
        return this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    async setName(name: string): Promise<void>
    {
        this.name = name;
        if (!this.region)
        {
            return;
        }
        const msg = new ObjectNameMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        msg.ObjectData = [
            {
                LocalID: this.ID,
                Name: Utils.StringToBuffer(name)
            }
        ];
        return this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    async setGeometry(pos?: Vector3, rot?: Quaternion, scale?: Vector3, wholeLinkset: boolean = false): Promise<void>
    {
        const data = [];
        const linked = (wholeLinkset) ? UpdateType.Linked : 0;
        if (pos !== undefined)
        {
            this.Position = pos;
            data.push({
                ObjectLocalID: this.ID,
                Type: UpdateType.Position | linked,
                Data: pos.getBuffer()
            });
        }
        if (rot !== undefined)
        {
            this.Rotation = rot;
            data.push({
                ObjectLocalID: this.ID,
                Type: UpdateType.Rotation | linked,
                Data: rot.getBuffer()
            })
        }
        if (scale !== undefined)
        {
            this.Scale = scale;
            data.push({
                ObjectLocalID: this.ID,
                Type: UpdateType.Scale | linked,
                Data: scale.getBuffer()
            })
        }
        if (!this.region || data.length === 0)
        {
            return;
        }
        const msg = new MultipleObjectUpdateMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        msg.ObjectData = data;
        return this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 30000);
    }

    linkTo(rootObj: GameObject): Promise<void>
    {
        const msg = new ObjectLinkMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        msg.ObjectData = [
            {
                ObjectLocalID: rootObj.ID
            },
            {
                ObjectLocalID: this.ID
            }
        ];
        return this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 30000);
    }

    async linkFrom(objects: GameObject[]): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (objects.length === 0)
            {
                resolve();
                return;
            }
            const primsExpectingUpdate: {[key: number]: GameObject} = {};
            const msg = new ObjectLinkMessage();
            msg.AgentData = {
                AgentID: this.region.agent.agentID,
                SessionID: this.region.circuit.sessionID
            };
            msg.ObjectData = [
                {
                    ObjectLocalID: this.ID
                }
            ];
            primsExpectingUpdate[this.ID] = this;
            for (const obj of objects)
            {
                msg.ObjectData.push(
                    {
                        ObjectLocalID: obj.ID
                    });
                primsExpectingUpdate[obj.ID] = obj;
            }
            this.region.circuit.waitForMessage<ObjectUpdateMessage>(Message.ObjectUpdate, 10000, (message: ObjectUpdateMessage) =>
            {
                let match = false;
                for (const obj of message.ObjectData)
                {
                    const num = obj.ID;
                    if (primsExpectingUpdate[num] !== undefined)
                    {
                        delete primsExpectingUpdate[num];
                        match = true;
                    }
                }
                if (match)
                {
                    if (Object.keys(primsExpectingUpdate).length === 0)
                    {
                        return FilterResponse.Finish;
                    }
                    return FilterResponse.Match;
                }
                return FilterResponse.NoMatch;
            }).then(() =>
            {
                resolve();
            }).catch((err) =>
            {
                reject(err);
            });
            this.region.circuit.sendMessage(msg, PacketFlags.Reliable);
        });

    }

    async setDescription(desc: string): Promise<void>
    {
        this.description = desc;
        if (!this.region)
        {
            return;
        }
        const msg = new ObjectDescriptionMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        msg.ObjectData = [
            {
                LocalID: this.ID,
                Description: Utils.StringToBuffer(desc)
            }
        ];
        return this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    async setTextureEntry(e: TextureEntry): Promise<void>
    {
        this.TextureEntry = e;
        if (!this.region)
        {
            return;
        }

        return this.setTextureAndMediaURL();
    }

    setTextureAndMediaURL(): Promise<void>
    {
        const msg = new ObjectImageMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        if (this.MediaURL === undefined)
        {
            this.MediaURL = '';
        }
        if (this.TextureEntry === undefined)
        {
            this.TextureEntry = new TextureEntry();
        }
        msg.ObjectData = [
            {
                ObjectLocalID: this.ID,
                TextureEntry: this.TextureEntry.toBuffer(),
                MediaURL: Utils.StringToBuffer(this.MediaURL)
            }
        ];
        return this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    async setExtraParams(ex: ExtraParams): Promise<void>
    {
        this.extraParams = ex;
        if (!this.region)
        {
            return;
        }

        // Set ExtraParams
        const msg = new ObjectExtraParamsMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        msg.ObjectData = [];
        let params = 0;
        if (ex.lightData !== null)
        {
            params++;
            const data = ex.lightData.getBuffer();
            msg.ObjectData.push({
                ObjectLocalID: this.ID,
                ParamType: ExtraParamType.Light,
                ParamInUse: (ex.lightData.Intensity !== 0.0),
                ParamData: data,
                ParamSize: data.length
            });
        }
        if (ex.flexibleData !== null)
        {
            params++;
            const data = ex.flexibleData.getBuffer();
            msg.ObjectData.push({
                ObjectLocalID: this.ID,
                ParamType: ExtraParamType.Flexible,
                ParamInUse: true,
                ParamData: data,
                ParamSize: data.length
            });
        }
        if (ex.lightImageData !== null)
        {
            params++;
            const data = ex.lightImageData.getBuffer();
            msg.ObjectData.push({
                ObjectLocalID: this.ID,
                ParamType: ExtraParamType.LightImage,
                ParamInUse: true,
                ParamData: data,
                ParamSize: data.length
            });
        }
        if (ex.sculptData !== null)
        {
            params++;
            const data = ex.sculptData.getBuffer();
            msg.ObjectData.push({
                ObjectLocalID: this.ID,
                ParamType: ExtraParamType.Sculpt,
                ParamInUse: true,
                ParamData: data,
                ParamSize: data.length
            });
        }
        if (ex.meshData !== null)
        {
            params++;
            const data = ex.meshData.getBuffer();
            msg.ObjectData.push({
                ObjectLocalID: this.ID,
                ParamType: ExtraParamType.Mesh,
                ParamInUse: true,
                ParamData: data,
                ParamSize: data.length
            });
        }
        if (params > 0)
        {
            const ack = this.region.circuit.sendMessage(msg, PacketFlags.Reliable);
            return this.region.circuit.waitForAck(ack, 10000);
        }
    }

    private async getInventoryXML(xml: XMLNode, inv: InventoryItem): Promise<void>
    {
        if (!inv.assetID.isZero() || !inv.itemID.isZero())
        {
            const item = xml.ele('TaskInventoryItem');

            if (inv.inventoryType === InventoryType.Object && inv.assetID.isZero())
            {
                inv.assetID = inv.itemID;
            }

            UUID.getXML(item.ele('AssetID'), inv.assetID);
            UUID.getXML(item.ele('ItemID'), inv.itemID);

            if (inv.permissions)
            {
                item.ele('BasePermissions', inv.permissions.baseMask);
                item.ele('EveryonePermissions', inv.permissions.everyoneMask);
                item.ele('GroupPermissions', inv.permissions.groupMask);
                item.ele('NextPermissions', inv.permissions.nextOwnerMask);
                item.ele('CurrentPermissions', inv.permissions.ownerMask);
                item.ele('PermsMask', 0);
                UUID.getXML(item.ele('CreatorID'), inv.permissions.creator);
                UUID.getXML(item.ele('LastOwnerID'), inv.permissions.lastOwner);
                UUID.getXML(item.ele('OwnerID'), inv.permissions.owner);
                UUID.getXML(item.ele('GroupID'), inv.permissions.group);

            }
            item.ele('CreationDate', inv.created.getTime() / 1000);
            item.ele('Description', inv.description);
            item.ele('InvType', inv.inventoryType);

            // For wearables, OpenSim expects flags to include the wearable type
            if (inv.inventoryType === InventoryType.Wearable && !inv.assetID.isZero())
            {
                try
                {
                    const type = (inv.type === 5 ? HTTPAssets.ASSET_CLOTHING : HTTPAssets.ASSET_BODYPART);
                    const data = await this.region.clientCommands.asset.downloadAsset(type, inv.assetID);
                    const wearable: LLWearable = new LLWearable(data.toString('utf-8'));
                    inv.flags = inv.flags | wearable.type;
                }
                catch (error)
                {
                    console.error(error);
                }
            }

            item.ele('Flags', inv.flags);
            UUID.getXML(item.ele('ParentID'), this.FullID);
            UUID.getXML(item.ele('ParentPartID'), this.FullID);
            item.ele('Type', inv.type);
            item.ele('Name', inv.name);
        }
    }

    private async getXML(xml: XMLNode, rootPrim: GameObject, linkNum: number, rootNode?: string): Promise<void>
    {
        if (this.resolvedAt === undefined || this.resolvedAt === 0 || this.resolvedInventory === false)
        {
            await this.region.resolver.resolveObjects([this], true, false, false);
        }
        let root = xml;
        if (rootNode)
        {
            root = xml.ele(rootNode);
        }
        const sceneObjectPart = root.ele('SceneObjectPart').att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance').att('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema');
        sceneObjectPart.ele('AllowedDrop', (this.Flags !== undefined && (this.Flags & PrimFlags.AllowInventoryDrop) !== 0) ? 'true' : 'false');
        UUID.getXML(sceneObjectPart.ele('CreatorID'), this.creatorID);
        UUID.getXML(sceneObjectPart.ele('FolderID'), this.folderID);
        sceneObjectPart.ele('InventorySerial', this.inventorySerial);
        UUID.getXML(sceneObjectPart.ele('UUID'), this.FullID);
        sceneObjectPart.ele('LocalId', this.ID);
        sceneObjectPart.ele('Name', this.name);
        sceneObjectPart.ele('Material', this.Material);
        sceneObjectPart.ele('RegionHandle', this.region.regionHandle.toString());
        Vector3.getXML(sceneObjectPart.ele('GroupPosition'), rootPrim.Position);
        if (rootPrim === this)
        {
            Vector3.getXML(sceneObjectPart.ele('OffsetPosition'), Vector3.getZero());
        }
        else
        {
            Vector3.getXML(sceneObjectPart.ele('OffsetPosition'), this.Position);
        }
        Quaternion.getXML(sceneObjectPart.ele('RotationOffset'), this.Rotation);
        Vector3.getXML(sceneObjectPart.ele('Velocity'), this.Velocity);
        Vector3.getXML(sceneObjectPart.ele('AngularVelocity'), this.AngularVelocity);
        Vector3.getXML(sceneObjectPart.ele('Acceleration'), this.Acceleration);
        sceneObjectPart.ele('Description', this.description);
        if (this.Text !== undefined && this.Text !== '')
        {
            sceneObjectPart.ele('Text', this.Text);
        }
        if (this.TextColor !== undefined)
        {
            Color4.getXML(sceneObjectPart.ele('Color'), this.TextColor);
        }
        sceneObjectPart.ele('SitName', this.sitName);
        sceneObjectPart.ele('TouchName', this.touchName);
        sceneObjectPart.ele('LinkNum', linkNum);
        sceneObjectPart.ele('ClickAction', this.ClickAction);
        const shape = sceneObjectPart.ele('Shape');
        {
            shape.ele('ProfileCurve', this.ProfileCurve);
            if (this.TextureEntry)
            {
                shape.ele('TextureEntry', this.TextureEntry.toBase64());
            }
            if (this.extraParams)
            {
                shape.ele('ExtraParams', this.extraParams.toBase64());
            }
            shape.ele('PathBegin', Utils.packBeginCut(Utils.numberOrZero(this.PathBegin)));
            shape.ele('PathCurve', this.PathCurve);
            shape.ele('PathEnd', Utils.packEndCut(Utils.numberOrZero(this.PathEnd)));
            shape.ele('PathRadiusOffset', Utils.packPathTwist(Utils.numberOrZero(this.PathRadiusOffset)));
            shape.ele('PathRevolutions', Utils.packPathRevolutions(Utils.numberOrZero(this.PathRevolutions)));
            shape.ele('PathScaleX', Utils.packPathScale(Utils.numberOrZero(this.PathScaleX)));
            shape.ele('PathScaleY', Utils.packPathScale(Utils.numberOrZero(this.PathScaleY)));
            shape.ele('PathShearX', Utils.packPathShear(Utils.numberOrZero(this.PathShearX)));
            shape.ele('PathShearY', Utils.packPathShear(Utils.numberOrZero(this.PathShearY)));
            shape.ele('PathSkew',  Utils.packPathTwist(Utils.numberOrZero(this.PathSkew)));
            shape.ele('PathTaperX',  Utils.packPathTaper(Utils.numberOrZero(this.PathTaperX)));
            shape.ele('PathTaperY',  Utils.packPathTaper(Utils.numberOrZero(this.PathTaperY)));
            shape.ele('PathTwist',  Utils.packPathTwist(Utils.numberOrZero(this.PathTwist)));
            shape.ele('PathTwistBegin',  Utils.packPathTwist(Utils.numberOrZero(this.PathTwistBegin)));
            shape.ele('PCode', this.PCode);
            shape.ele('ProfileBegin',  Utils.packBeginCut(Utils.numberOrZero(this.ProfileBegin)));
            shape.ele('ProfileEnd',  Utils.packEndCut(Utils.numberOrZero(this.ProfileEnd)));
            shape.ele('ProfileHollow',  Utils.packProfileHollow(Utils.numberOrZero(this.ProfileHollow)));

            // This is wrong, but opensim expects it
            const mask = 0xf << 4 >>> 0;
            if (this.State === undefined)
            {
                this.State = 0;
            }
            let state = (((this.State & mask) >>> 4) | ((this.State & ~mask) << 4)) >>> 0;
            state = state | this.attachmentPoint;
            shape.ele('State', state);
            shape.ele('LastAttachPoint', 0);

            if (this.ProfileCurve)
            {

                const profileShape: ProfileShape = this.ProfileCurve & 0x0F;
                const holeType: HoleType = this.ProfileCurve & 0xF0;

                shape.ele('ProfileShape', ProfileShape[profileShape]);
                shape.ele('HollowShape', HoleType[holeType]);
            }
            if (this.extraParams !== undefined && this.extraParams.meshData !== null)
            {
                shape.ele('SculptType', this.extraParams.meshData.type);
                UUID.getXML(shape.ele('SculptTexture'), this.extraParams.meshData.meshData);
                shape.ele('SculptEntry', true);
            }
            else if (this.extraParams !== undefined && this.extraParams.sculptData !== null)
            {
                shape.ele('SculptType', this.extraParams.sculptData.type);
                UUID.getXML(shape.ele('SculptTexture'), this.extraParams.sculptData.texture);
                shape.ele('SculptEntry', true);
            }
            else
            {
                shape.ele('SculptEntry', false);
            }
            if (this.extraParams !== undefined && this.extraParams.flexibleData !== null)
            {
                shape.ele('FlexiSoftness', this.extraParams.flexibleData.Softness);
                shape.ele('FlexiTension', this.extraParams.flexibleData.Tension);
                shape.ele('FlexiDrag', this.extraParams.flexibleData.Drag);
                shape.ele('FlexiGravity', this.extraParams.flexibleData.Gravity);
                shape.ele('FlexiWind', this.extraParams.flexibleData.Wind);
                shape.ele('FlexiForceX', this.extraParams.flexibleData.Force.x);
                shape.ele('FlexiForceY', this.extraParams.flexibleData.Force.y);
                shape.ele('FlexiForceZ', this.extraParams.flexibleData.Force.z);
                shape.ele('FlexiEntry', true);
            }
            else
            {
                shape.ele('FlexiEntry', false);
            }
            if (this.extraParams !== undefined && this.extraParams.lightData !== null)
            {
                shape.ele('LightColorR', this.extraParams.lightData.Color.red);
                shape.ele('LightColorG', this.extraParams.lightData.Color.green);
                shape.ele('LightColorB', this.extraParams.lightData.Color.blue);
                shape.ele('LightColorA', this.extraParams.lightData.Color.alpha);
                shape.ele('LightRadius', this.extraParams.lightData.Radius);
                shape.ele('LightCutoff', this.extraParams.lightData.Cutoff);
                shape.ele('LightFalloff', this.extraParams.lightData.Falloff);
                shape.ele('LightIntensity', this.extraParams.lightData.Intensity);
                shape.ele('LightEntry', true);
            }
            else
            {
                shape.ele('LightEntry', false);
            }

        }
        Vector3.getXML(sceneObjectPart.ele('Scale'), this.Scale);
        sceneObjectPart.ele('ParentID', this.ParentID);
        sceneObjectPart.ele('CreationDate', Math.round((new Date()).getTime() / 1000));
        sceneObjectPart.ele('Category', this.category);
        if (this.IsAttachment)
        {
            Vector3.getXML(sceneObjectPart.ele('AttachPos'), this.Position);
        }
        sceneObjectPart.ele('SalePrice', this.salePrice);
        sceneObjectPart.ele('ObjectSaleType', this.saleType);
        sceneObjectPart.ele('OwnershipCost', this.ownershipCost);
        UUID.getXML(sceneObjectPart.ele('GroupID'), this.groupID);
        UUID.getXML(sceneObjectPart.ele('OwnerID'), this.OwnerID);
        UUID.getXML(sceneObjectPart.ele('LastOwnerID'), this.lastOwnerID);
        sceneObjectPart.ele('BaseMask', this.baseMask);
        sceneObjectPart.ele('OwnerMask', this.ownerMask);
        sceneObjectPart.ele('GroupMask', this.groupMask);
        sceneObjectPart.ele('EveryoneMask', this.everyoneMask);
        sceneObjectPart.ele('NextOwnerMask', this.nextOwnerMask);
        const flags = [];
        if (this.Flags !== undefined)
        {
            for (const flag of Object.keys(PrimFlags))
            {
                if (typeof flag === 'string')
                {
                    const fl: any = PrimFlags;
                    const flagName: string = flag;
                    const flagValue: number = fl[flagName];
                    if (this.Flags & flagValue)
                    {
                        flags.push(flagName);
                    }
                }
            }
        }
        sceneObjectPart.ele('Flags', flags.join(' '));
        if (this.textureAnim)
        {
            sceneObjectPart.ele('TextureAnimation', this.textureAnim.toBase64());
        }
        if (this.Particles)
        {
            sceneObjectPart.ele('ParticleSystem', this.Particles.toBase64());
        }
        if (this.physicsShapeType)
        {
            sceneObjectPart.ele('PhysicsShapeType', this.physicsShapeType);
        }
        if (this.Sound && !this.Sound.isZero())
        {
            UUID.getXML(sceneObjectPart.ele('SoundID'), this.Sound);
            sceneObjectPart.ele('SoundGain', this.SoundGain);
            sceneObjectPart.ele('SoundFlags', this.SoundFlags);
            sceneObjectPart.ele('SoundRadius', this.SoundRadius);
            sceneObjectPart.ele('SoundQueueing', false);
        }
        if (this.inventory && this.inventory.length > 0)
        {
            const inventory = sceneObjectPart.ele('TaskInventory');
            for (const inv of this.inventory)
            {
                await this.getInventoryXML(inventory, inv);
            }
        }
    }

    populateChildren(): void
    {
        this.region.objects.populateChildren(this);
    }

    async exportXMLElement(rootNode?: string): Promise<XMLElement>
    {
        const document = builder.create('SceneObjectGroup');
        let linkNum = 1;
        await this.getXML(document, this, linkNum, rootNode);
        if (this.children && this.children.length > 0)
        {
            const otherParts = document.ele('OtherParts');
            for (const child of this.children)
            {
                await child.getXML(otherParts, this, ++linkNum, (rootNode !== undefined) ? 'Part' : undefined);
            }
        }
        return document;
    }

    async exportXML(rootNode?: string): Promise<string>
    {
        return (await this.exportXMLElement(rootNode)).end({pretty: true, allowEmpty: true});
    }

    public toJSON(): IGameObjectData
    {
        return {
            deleted: this.deleted,
            creatorID: this.creatorID,
            creationDate: this.creationDate,
            baseMask: this.baseMask,
            ownerMask: this.ownerMask,
            groupMask: this.groupMask,
            everyoneMask: this.everyoneMask,
            nextOwnerMask: this.nextOwnerMask,
            ownershipCost: this.ownershipCost,
            saleType: this.saleType,
            salePrice: this.salePrice,
            aggregatePerms: this.aggregatePerms,
            aggregatePermTextures: this.aggregatePermTextures,
            aggregatePermTexturesOwner: this.aggregatePermTexturesOwner,
            category: this.category,
            inventorySerial: this.inventorySerial,
            itemID: this.itemID,
            folderID: this.folderID,
            fromTaskID: this.fromTaskID,
            lastOwnerID: this.lastOwnerID,
            name: this.name,
            description: this.description,
            touchName: this.touchName,
            sitName: this.sitName,
            resolvedAt: this.resolvedAt,
            resolvedInventory: this.resolvedInventory,
            totalChildren: this.totalChildren,
            landImpact: this.landImpact,
            calculatedLandImpact: this.calculatedLandImpact,
            physicaImpact: this.physicaImpact,
            resourceImpact: this.resourceImpact,
            linkResourceImpact: this.linkResourceImpact,
            linkPhysicsImpact: this.linkPhysicsImpact,
            limitingType: this.limitingType,
            children: this.children,
            ID: this.ID,
            FullID: this.FullID,
            ParentID: this.ParentID,
            OwnerID: this.OwnerID,
            IsAttachment: this.IsAttachment,
            NameValue: this.NameValue,
            PCode: this.PCode,
            State: this.State,
            CRC: this.CRC,
            Material: this.Material,
            ClickAction: this.ClickAction,
            Scale: this.Scale,
            Flags: this.Flags,
            PathCurve: this.PathCurve,
            ProfileCurve: this.ProfileCurve,
            PathBegin: this.PathBegin,
            PathEnd: this.PathEnd,
            PathScaleX: this.PathScaleX,
            PathScaleY: this.PathScaleY,
            PathShearX: this.PathShearX,
            PathShearY: this.PathShearY,
            PathTwist: this.PathTwist,
            PathTwistBegin: this.PathTwistBegin,
            PathRadiusOffset: this.PathRadiusOffset,
            PathTaperX: this.PathTaperX,
            PathTaperY: this.PathTaperY,
            PathRevolutions: this.PathRevolutions,
            PathSkew: this.PathSkew,
            ProfileBegin: this.ProfileBegin,
            ProfileEnd: this.ProfileEnd,
            ProfileHollow: this.ProfileHollow,
            TextureEntry: this.TextureEntry,
            Text: this.Text,
            TextColor: this.TextColor,
            MediaURL: this.MediaURL,
            JointType: this.JointType,
            JointPivot: this.JointPivot,
            JointAxisOrAnchor: this.JointAxisOrAnchor,
            Position: this.Position,
            Rotation: this.Rotation,
            CollisionPlane: this.CollisionPlane,
            Velocity: this.Velocity,
            Acceleration: this.Acceleration,
            AngularVelocity: this.AngularVelocity,
            TreeSpecies: this.TreeSpecies,
            Sound: this.Sound,
            SoundGain: this.SoundGain,
            SoundFlags: this.SoundFlags,
            SoundRadius: this.SoundRadius,
            Particles: this.Particles,
            density: this.density,
            friction: this.friction,
            gravityMultiplier: this.gravityMultiplier,
            physicsShapeType: this.physicsShapeType,
            restitution: this.restitution
        }
    }
    setObjectData(data: Buffer): void
    {
        let dataPos = 0;

        // noinspection FallThroughInSwitchStatementJS, TsLint
        switch (data.length)
        {
            // @ts-ignore
            case 76:
                // Avatar collision normal;
                this.CollisionPlane = new Vector4(data, dataPos);
                dataPos += 16;
                /* falls through */
            case 60:
                // Position
                this.Position = new Vector3(data, dataPos);
                dataPos += 12;
                this.Velocity = new Vector3(data, dataPos);
                dataPos += 12;
                this.Acceleration = new Vector3(data, dataPos);
                dataPos += 12;
                this.Rotation = new Quaternion(data, dataPos);
                dataPos += 12;
                this.AngularVelocity = new Vector3(data, dataPos);
                dataPos += 12;
                break;
            // @ts-ignore
            case 48:
                this.CollisionPlane = new Vector4(data, dataPos);
                dataPos += 16;
                /* falls through */
            case 32:
                this.Position = new Vector3([
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos), -0.5 * 256.0, 1.5 * 256.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 2), -0.5 * 256.0, 1.5 * 256.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 4), -256.0, 3.0 * 256.0)
                ]);
                dataPos += 6;
                this.Velocity = new Vector3([
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos), -256.0, 256.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 2), -256.0, 256.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 4), -256.0, 256.0)
                ]);
                dataPos += 6;
                this.Acceleration = new Vector3([
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos), -256.0, 256.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 2), -256.0, 256.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 4), -256.0, 256.0)
                ]);
                dataPos += 6;
                this.Rotation = new Quaternion([
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos), -1.0, 1.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 2), -1.0, 1.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 4), -1.0, 1.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 4), -1.0, 1.0)
                ]);
                dataPos += 8;
                this.AngularVelocity = new Vector3([
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos), -256.0, 256.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 2), -256.0, 256.0),
                    Utils.UInt16ToFloat(data.readUInt16LE(dataPos + 4), -256.0, 256.0)
                ]);
                dataPos += 6;
                break;
            case 16:
                this.Position = new Vector3([
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0)
                ]);
                this.Velocity = new Vector3([
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0)
                ]);
                this.Acceleration = new Vector3([
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0)
                ]);
                this.Rotation = new Quaternion([
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -1.0, 1.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -1.0, 1.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -1.0, 1.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -1.0, 1.0)
                ]);
                this.AngularVelocity = new Vector3([
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0),
                    Utils.ByteToFloat(data.readUInt8(dataPos++), -256.0, 256.0)
                ]);
                break;
        }
    }

    async deRezObject(destination: DeRezDestination, transactionID: UUID, destFolder: UUID): Promise<void>
    {
        return GameObject.deRezObjects(this.region, [this], destination, transactionID, destFolder);
    }

    async takeToInventory(folder?: InventoryFolder): Promise<InventoryItem>
    {
        return GameObject.takeManyToInventory(this.region, [this], folder);
    }

    async dropInventoryIntoContents(inventoryItem: InventoryItem | UUID): Promise<void>
    {
        const transactionID = UUID.zero();

        if (inventoryItem instanceof UUID)
        {

            const item: InventoryItem | null = await this.region.agent.inventory.fetchInventoryItem(inventoryItem);
            if (item === null)
            {
                throw new Error('Failed to drop inventory into object contents - Inventory item ' + inventoryItem.toString() + ' not found');
                return;
            }
            inventoryItem = item;
        }

        const msg = new UpdateTaskInventoryMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        msg.UpdateData = {
            Key: 0,
            LocalID: this.ID
        };
        msg.InventoryData = {
            ItemID: inventoryItem.itemID,
            FolderID: inventoryItem.parentID,
            CreatorID: inventoryItem.permissions.creator,
            OwnerID: inventoryItem.permissions.owner,
            GroupID: inventoryItem.permissions.group,
            BaseMask: inventoryItem.permissions.baseMask,
            OwnerMask: inventoryItem.permissions.ownerMask,
            GroupMask: inventoryItem.permissions.groupMask,
            EveryoneMask: inventoryItem.permissions.everyoneMask,
            NextOwnerMask: inventoryItem.permissions.nextOwnerMask,
            GroupOwned: inventoryItem.permissions.groupOwned || false,
            TransactionID: transactionID,
            Type: inventoryItem.type,
            InvType: inventoryItem.inventoryType,
            Flags: inventoryItem.flags,
            SaleType: inventoryItem.saleType,
            SalePrice: inventoryItem.salePrice,
            Name: Utils.StringToBuffer(inventoryItem.name),
            Description: Utils.StringToBuffer(inventoryItem.description),
            CreationDate: inventoryItem.created.getTime() / 1000,
            CRC: inventoryItem.getCRC()
        };
        const serial = this.inventorySerial;
        this.region.circuit.sendMessage(msg, PacketFlags.Reliable);
        return this.waitForInventoryUpdate(serial);
    }

    async waitForInventoryUpdate(inventorySerial?: number): Promise<void>
    {
        // We need to select the object or we won't get the objectProperties message
        this.select();
        await this.region.circuit.waitForMessage<ObjectPropertiesMessage>(Message.ObjectProperties, 10000, (message: ObjectPropertiesMessage) =>
        {
            for (const obj of message.ObjectData)
            {
                if (obj.ObjectID.equals(this.FullID))
                {
                    if (inventorySerial === undefined)
                    {
                        inventorySerial = this.inventorySerial;
                    }
                    if (obj.InventorySerial > inventorySerial)
                    {
                        return FilterResponse.Finish;
                    }
                }
            }
            return FilterResponse.NoMatch;
        });
        await this.deselect();
    }

    select(): Promise<void>
    {
        const selectObject = new ObjectSelectMessage();
        selectObject.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        selectObject.ObjectData = [{
            ObjectLocalID: this.ID
        }];
        const ack = this.region.circuit.sendMessage(selectObject, PacketFlags.Reliable);
        return this.region.circuit.waitForAck(ack, 10000);
    }

    deselect(): Promise<void>
    {
        const deselectObject = new ObjectDeselectMessage();
        deselectObject.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        deselectObject.ObjectData = [{
            ObjectLocalID: this.ID
        }];
        const ack = this.region.circuit.sendMessage(deselectObject, PacketFlags.Reliable);
        return this.region.circuit.waitForAck(ack, 10000);
    }
}
