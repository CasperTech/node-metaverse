import {Vector3} from '../Vector3';
import {UUID} from '../UUID';
import {Quaternion} from '../Quaternion';
import {Tree} from '../../enums/Tree';
import {Vector4} from '../Vector4';
import {TextureEntry} from '../TextureEntry';
import {Color4} from '../Color4';
import {ParticleSystem} from '../ParticleSystem';
import {ITreeBoundingBox} from '../interfaces/ITreeBoundingBox';
import {NameValue} from '../NameValue';
import * as Long from 'long';
import {IGameObjectData} from '../interfaces/IGameObjectData';
import {
    HoleType,
    HTTPAssets, PacketFlags,
    PCode,
    PhysicsShapeType,
    PrimFlags,
    ProfileShape,
    SculptType,
    SoundFlags,
    Utils
} from '../..';
import * as builder from 'xmlbuilder';
import * as xml2js from 'xml2js';
import {Region} from '../Region';
import {InventoryItem} from '../InventoryItem';
import {InventoryType} from '../../enums/InventoryType';
import {LLWearable} from '../LLWearable';
import {TextureAnim} from './TextureAnim';
import {ExtraParams} from './ExtraParams';
import {ObjectExtraParamsMessage} from '../messages/ObjectExtraParams';
import {ExtraParamType} from '../../enums/ExtraParamType';
import {ObjectImageMessage} from '../messages/ObjectImage';
import {ObjectNameMessage} from '../messages/ObjectName';
import {ObjectDescriptionMessage} from '../messages/ObjectDescription';
import {MultipleObjectUpdateMessage} from '../messages/MultipleObjectUpdate';
import {UpdateType} from '../../enums/UpdateType';
import {ObjectLinkMessage} from '../messages/ObjectLink';
import {ObjectShapeMessage} from '../messages/ObjectShape';
import {XMLNode} from 'xmlbuilder';

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

    region: Region;

    inventory: InventoryItem[] = [];

    resolveAttempts = 0;

    claimedForBuild = false;

    private static getFromXMLJS(obj: any, param: string): any
    {
        if (obj[param] === undefined)
        {
            return undefined;
        }
        let retParam;
        if (Array.isArray(obj[param]))
        {
            retParam = obj[param][0];
        }
        else
        {
            retParam = obj[param];
        }
        if (typeof retParam === 'string')
        {
            if (retParam.toLowerCase() === 'false')
            {
                return false;
            }
            if (retParam.toLowerCase() === 'true')
            {
                return true;
            }
            const numVar = parseInt(retParam, 10);
            if (numVar >= Number.MIN_SAFE_INTEGER && numVar <= Number.MAX_SAFE_INTEGER && String(numVar) === retParam)
            {
                return numVar
            }
        }
        return retParam;
    }

    private static partFromXMLJS(obj: any, root: boolean)
    {
        const go = new GameObject();
        go.Flags = 0;
        let prop: any;
        if (this.getFromXMLJS(obj, 'AllowedDrop') !== undefined)
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
        if ((prop = this.getFromXMLJS(obj, 'InventorySerial')) !== undefined)
        {
            go.inventorySerial = prop;
        }
        if ((prop = UUID.fromXMLJS(obj, 'UUID')) !== undefined)
        {
            go.FullID = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'LocalId')) !== undefined)
        {
            go.ID = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'Name')) !== undefined)
        {
            go.name = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'Material')) !== undefined)
        {
            go.Material = prop;
        }
        if ((prop = Vector3.fromXMLJS(obj, 'GroupPosition')) !== undefined)
        {
            if (root)
            {
                go.Position = prop;
            }
        }
        if ((prop = Vector3.fromXMLJS(obj, 'OffsetPosition')) !== undefined)
        {
            if (!root)
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
        if ((prop = this.getFromXMLJS(obj, 'Description')) !== undefined)
        {
            go.description = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'Text')) !== undefined)
        {
            go.Text = prop;
        }
        if ((prop = Color4.fromXMLJS(obj, 'Color')) !== undefined)
        {
            go.TextColor = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'SitName')) !== undefined)
        {
            go.sitName = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'TouchName')) !== undefined)
        {
            go.touchName = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'ClickAction')) !== undefined)
        {
            go.ClickAction = prop;
        }
        if ((prop = Vector3.fromXMLJS(obj, 'Scale')) !== undefined)
        {
            go.Scale = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'ParentID')) !== undefined)
        {
            go.ParentID = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'Category')) !== undefined)
        {
            go.category = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'SalePrice')) !== undefined)
        {
            go.salePrice = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'ObjectSaleType')) !== undefined)
        {
            go.saleType = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'OwnershipCost')) !== undefined)
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
        if ((prop = this.getFromXMLJS(obj, 'BaseMask')) !== undefined)
        {
            go.baseMask = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'OwnerMask')) !== undefined)
        {
            go.ownerMask = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'GroupMask')) !== undefined)
        {
            go.groupMask = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'EveryoneMask')) !== undefined)
        {
            go.everyoneMask = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'NextOwnerMask')) !== undefined)
        {
            go.nextOwnerMask = prop;
        }
        if ((prop = this.getFromXMLJS(obj, 'Flags')) !== undefined)
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
        if ((prop = this.getFromXMLJS(obj, 'TextureAnimation')) !== undefined)
        {
            const buf = Buffer.from(prop, 'base64');
            go.textureAnim = TextureAnim.from(buf);
        }
        if ((prop = this.getFromXMLJS(obj, 'ParticleSystem')) !== undefined)
        {
            const buf = Buffer.from(prop, 'base64');
            go.Particles = ParticleSystem.from(buf);
        }
        if ((prop = this.getFromXMLJS(obj, 'PhysicsShapeType')) !== undefined)
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
        if ((prop = this.getFromXMLJS(obj, 'Shape')) !== undefined)
        {
            const shape = prop;
            if ((prop = this.getFromXMLJS(shape, 'ProfileCurve')) !== undefined)
            {
                go.ProfileCurve = prop;
            }
            if ((prop = this.getFromXMLJS(shape, 'TextureEntry')) !== undefined)
            {
                const buf = Buffer.from(prop, 'base64');
                go.TextureEntry = TextureEntry.from(buf);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathBegin')) !== undefined)
            {
                go.PathBegin = Utils.unpackBeginCut(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathCurve')) !== undefined)
            {
                go.PathCurve = prop;
            }
            if ((prop = this.getFromXMLJS(shape, 'PathEnd')) !== undefined)
            {
                go.PathEnd = Utils.unpackEndCut(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathRadiusOffset')) !== undefined)
            {
                go.PathRadiusOffset = Utils.unpackPathTwist(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathRevolutions')) !== undefined)
            {
                go.PathRevolutions = Utils.unpackPathRevolutions(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathScaleX')) !== undefined)
            {
                go.PathScaleX = Utils.unpackPathScale(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathScaleY')) !== undefined)
            {
                go.PathScaleY = Utils.unpackPathScale(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathShearX')) !== undefined)
            {
                go.PathShearX = Utils.unpackPathShear(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathShearY')) !== undefined)
            {
                go.PathShearY = Utils.unpackPathShear(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathSkew')) !== undefined)
            {
                go.PathSkew = Utils.unpackPathShear(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathTaperX')) !== undefined)
            {
                go.PathTaperX = Utils.unpackPathTaper(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathTaperY')) !== undefined)
            {
                go.PathTaperY = Utils.unpackPathTaper(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathTwist')) !== undefined)
            {
                go.PathTwist = Utils.unpackPathTwist(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PathTwistBegin')) !== undefined)
            {
                go.PathTwistBegin = Utils.unpackPathTwist(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'PCode')) !== undefined)
            {
                go.PCode = prop;
            }
            if ((prop = this.getFromXMLJS(shape, 'ProfileBegin')) !== undefined)
            {
                go.ProfileBegin = Utils.unpackBeginCut(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'ProfileEnd')) !== undefined)
            {
                go.ProfileEnd = Utils.unpackEndCut(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'ProfileHollow')) !== undefined)
            {
                go.ProfileHollow = Utils.unpackProfileHollow(prop);
            }
            if ((prop = this.getFromXMLJS(shape, 'State')) !== undefined)
            {
                go.State = prop;
            }
            if ((prop = this.getFromXMLJS(shape, 'ProfileShape')) !== undefined)
            {
                if (!go.ProfileCurve)
                {
                    go.ProfileCurve = 0;
                }
                go.ProfileCurve = go.ProfileCurve | parseInt(ProfileShape[prop], 10);
            }
            if ((prop = this.getFromXMLJS(shape, 'HollowShape')) !== undefined)
            {
                if (!go.ProfileCurve)
                {
                    go.ProfileCurve = 0;
                }
                go.ProfileCurve = go.ProfileCurve | parseInt(HoleType[prop], 10);
            }
            if (this.getFromXMLJS(shape, 'SculptEntry') !== undefined)
            {
                const type = this.getFromXMLJS(shape, 'SculptType');
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
            if (this.getFromXMLJS(shape, 'FlexiEntry') !== undefined)
            {
                const flexiSoftness = this.getFromXMLJS(shape, 'FlexiSoftness');
                const flexiTension = this.getFromXMLJS(shape, 'FlexiTension');
                const flexiDrag = this.getFromXMLJS(shape, 'FlexiDrag');
                const flexiGravity = this.getFromXMLJS(shape, 'FlexiGravity');
                const flexiWind = this.getFromXMLJS(shape, 'FlexiWind');
                const flexiForceX = this.getFromXMLJS(shape, 'FlexiForceX');
                const flexiForceY = this.getFromXMLJS(shape, 'FlexiForceY');
                const flexiForceZ = this.getFromXMLJS(shape, 'FlexiForceZ');
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
            if (this.getFromXMLJS(shape, 'LightEntry') !== undefined)
            {
                const lightColorR = this.getFromXMLJS(shape, 'LightColorR');
                const lightColorG = this.getFromXMLJS(shape, 'LightColorG');
                const lightColorB = this.getFromXMLJS(shape, 'LightColorB');
                const lightColorA = this.getFromXMLJS(shape, 'LightColorA');
                const lightRadius = this.getFromXMLJS(shape, 'LightRadius');
                const lightCutoff = this.getFromXMLJS(shape, 'LightCutoff');
                const lightFalloff = this.getFromXMLJS(shape, 'LightFalloff');
                const lightIntensity = this.getFromXMLJS(shape, 'LightIntensity');
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
            if ((prop = this.getFromXMLJS(shape, 'ExtraParams')) !== undefined)
            {
                const buf = Buffer.from(prop, 'base64');
                go.extraParams = ExtraParams.from(buf);
            }
        }
        // TODO: TaskInventory
        return go;
    }

    static fromXML(xml: string)
    {
        return new Promise<GameObject>((resolve, reject) =>
        {
            xml2js.parseString(xml, (err, result) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    if (!result['SceneObjectGroup'])
                    {
                        throw new Error('SceneObjectGroup not found');
                    }
                    result = result['SceneObjectGroup'];
                    if (!result['SceneObjectPart'])
                    {
                        throw new Error('Root part not found');
                    }
                    const rootPart = GameObject.partFromXMLJS(result['SceneObjectPart'][0], true);
                    rootPart.children = [];
                    rootPart.totalChildren = 0;
                    if (result['OtherParts'] && Array.isArray(result['OtherParts']) && result['OtherParts'].length > 0)
                    {
                        const obj = result['OtherParts'][0];
                        if (obj['SceneObjectPart'])
                        {
                            for (const part of obj['SceneObjectPart'])
                            {
                                rootPart.children.push(GameObject.partFromXMLJS(part, false));
                                rootPart.totalChildren++;
                            }
                        }
                    }
                    resolve(rootPart);
                }
            });
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

    setIfDefined(def?: number, v?: number)
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
                   ProfileHollow?: number)
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
        await this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    async setName(name: string)
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
        await this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    private compareParam(name: string, param1: number | undefined, param2: number | undefined): boolean
    {
        if (param1 === undefined)
        {
            param1 = 0;
        }
        if (param2 === undefined)
        {
            param2 = 0;
        }
        if (Math.abs(param1 - param2) < 0.0001)
        {
            return true;
        }
        else
        {
            console.log('Failed ' + name + ' - ' + param1 + ' vs ' + param2);
            return false;
        }
    }

    compareShape(obj: GameObject): boolean
    {
        return this.compareParam('PathCurve', this.PathCurve, obj.PathCurve) &&
        this.compareParam('ProfileCurve', this.ProfileCurve, obj.ProfileCurve) &&
        this.compareParam('PathBegin', this.PathBegin, obj.PathBegin) &&
        this.compareParam('PathEnd', this.PathEnd, obj.PathEnd) &&
        this.compareParam('PathScaleX', this.PathScaleX, obj.PathScaleX) &&
        this.compareParam('PathScaleY', this.PathScaleY, obj.PathScaleY) &&
        this.compareParam('PathShearX', this.PathShearX, obj.PathShearX) &&
        this.compareParam('PathShearY', this.PathShearY, obj.PathShearY) &&
        this.compareParam('PathTwist', this.PathTwist, obj.PathTwist) &&
        this.compareParam('PathTwistBegin', this.PathTwistBegin, obj.PathTwistBegin) &&
        this.compareParam('PathRadiusOffset', this.PathRadiusOffset, obj.PathRadiusOffset) &&
        this.compareParam('PathTaperX', this.PathTaperX, obj.PathTaperX) &&
        this.compareParam('PathTaperY', this.PathTaperY, obj.PathTaperY) &&
        this.compareParam('PathRevolutions', this.PathRevolutions, obj.PathRevolutions) &&
        this.compareParam('PathSkew', this.PathSkew, obj.PathSkew) &&
        this.compareParam('ProfileBegin', this.ProfileBegin, obj.ProfileBegin) &&
        this.compareParam('ProfileEnd', this.ProfileEnd, obj.ProfileEnd) &&
            this.compareParam('PRofileHollow', this.ProfileHollow, obj.ProfileHollow);
    }

    async setGeometry(pos?: Vector3, rot?: Quaternion, scale?: Vector3)
    {
        const data = [];
        if (pos !== undefined)
        {
            this.Position = pos;
            data.push({
                ObjectLocalID: this.ID,
                Type: UpdateType.Position,
                Data: pos.getBuffer()
            });
        }
        if (rot !== undefined)
        {
            this.Rotation = rot;
            data.push({
                ObjectLocalID: this.ID,
                Type: UpdateType.Rotation,
                Data: rot.getBuffer()
            })
        }
        if (scale !== undefined)
        {
            this.Scale = scale;
            data.push({
                ObjectLocalID: this.ID,
                Type: UpdateType.Scale,
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
        await this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 30000);
    }

    async linkTo(root: GameObject)
    {
        const msg = new ObjectLinkMessage();
        msg.AgentData = {
            AgentID: this.region.agent.agentID,
            SessionID: this.region.circuit.sessionID
        };
        msg.ObjectData = [
            {
                ObjectLocalID: root.ID
            },
            {
                ObjectLocalID: this.ID
            }
        ];
        await this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 30000);
    }

    async setDescription(desc: string)
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
        await this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    async setTextureEntry(e: TextureEntry)
    {
        this.TextureEntry = e;
        if (!this.region)
        {
            return;
        }

        await this.setTextureAndMediaURL();
    }

    private async setTextureAndMediaURL()
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
        await this.region.circuit.waitForAck(this.region.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    async setExtraParams(ex: ExtraParams)
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
            await this.region.circuit.waitForAck(ack, 10000);
        }
    }

    private async getInventoryXML(xml: XMLNode, inv: InventoryItem)
    {
        if (!inv.assetID.equals(UUID.zero()))
        {
            const item = xml.ele('TaskInventoryItem');
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
            if (inv.inventoryType === InventoryType.Wearable && !inv.assetID.equals(UUID.zero()))
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

    private async getXML(xml: XMLNode, rootPrim: GameObject, linkNum: number)
    {
        const sceneObjectPart = xml.ele('SceneObjectPart').att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance').att('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema');
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
            shape.ele('State', this.State);

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
        if (this.Sound && !this.Sound.equals(UUID.zero()))
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

    async exportXML(): Promise<string>
    {
        const document = builder.create('SceneObjectGroup');
        let linkNum = 1;
        await this.getXML(document, this, linkNum);
        if (this.children && this.children.length > 0)
        {
            const otherParts = document.ele('OtherParts');
            for (const child of this.children)
            {
                await child.getXML(otherParts, this, ++linkNum);
            }
        }
        return document.end({pretty: true, allowEmpty: true});
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
    setObjectData(data: Buffer)
    {
        let dataPos = 0;

        // noinspection FallThroughInSwitchStatementJS, TsLint
        switch (data.length)
        {
            case 76:
                // Avatar collision normal;
                this.CollisionPlane = new Vector4(data, dataPos);
                dataPos += 16;
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
            case 48:
                this.CollisionPlane = new Vector4(data, dataPos);
                dataPos += 16;
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
}
