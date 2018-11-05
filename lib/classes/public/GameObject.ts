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
    HTTPAssets,
    PCode,
    PhysicsShapeType,
    PrimFlags,
    ProfileShape, SculptType,
    SoundFlags,
    Utils
} from '../..';
import * as builder from 'xmlbuilder';
import {XMLElementOrXMLNode} from 'xmlbuilder';
import * as xml2js from 'xml2js';
import {Region} from '../Region';
import {InventoryItem} from '../InventoryItem';
import {InventoryType} from '../../enums/InventoryType';
import {LLWearable} from '../LLWearable';
import {TextureAnim} from './TextureAnim';
import {ExtraParams} from './ExtraParams';

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

    private static getFromXMLJS(obj: any, param: string): any
    {
        if (obj[param] === undefined)
        {
            return false;
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
        if (this.getFromXMLJS(obj, 'AllowedDrop'))
        {
            go.Flags = go.Flags | PrimFlags.AllowInventoryDrop;
        }
        if (prop = UUID.fromXMLJS(obj, 'CreatorID'))
        {
            go.creatorID = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'FolderID'))
        {
            go.folderID = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'InventorySerial'))
        {
            go.inventorySerial = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'UUID'))
        {
            go.FullID = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'LocalId'))
        {
            go.ID = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'Name'))
        {
            go.name = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'Material'))
        {
            go.Material = prop;
        }
        if (prop = Vector3.fromXMLJS(obj, 'GroupPosition'))
        {
            if (root)
            {
                go.Position = prop;
            }
        }
        if (prop = Vector3.fromXMLJS(obj, 'OffsetPosition'))
        {
            if (!root)
            {
                go.Position = prop;
            }
        }
        if (prop = Quaternion.fromXMLJS(obj, 'RotationOffset'))
        {
            go.Rotation = prop;
        }
        if (prop = Vector3.fromXMLJS(obj, 'Velocity'))
        {
            go.Velocity = prop;
        }
        if (prop = Vector3.fromXMLJS(obj, 'AngularVelocity'))
        {
            go.AngularVelocity = prop;
        }
        if (prop = Vector3.fromXMLJS(obj, 'Acceleration'))
        {
            go.Acceleration = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'Description'))
        {
            go.description = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'Text'))
        {
            go.Text = prop;
        }
        if (prop = Color4.fromXMLJS(obj, 'Color'))
        {
            go.TextColor = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'SitName'))
        {
            go.sitName = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'TouchName'))
        {
            go.touchName = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'ClickAction'))
        {
            go.ClickAction = prop;
        }
        if (prop = Vector3.fromXMLJS(obj, 'Scale'))
        {
            go.Scale = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'ParentID'))
        {
            go.ParentID = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'Category'))
        {
            go.category = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'SalePrice'))
        {
            go.salePrice = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'ObjectSaleType'))
        {
            go.saleType = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'OwnershipCost'))
        {
            go.ownershipCost = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'GroupID'))
        {
            go.groupID = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'OwnerID'))
        {
            go.OwnerID = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'LastOwnerID'))
        {
            go.lastOwnerID = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'BaseMask'))
        {
            go.baseMask = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'OwnerMask'))
        {
            go.ownerMask = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'GroupMask'))
        {
            go.groupMask = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'EveryoneMask'))
        {
            go.everyoneMask = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'NextOwnerMask'))
        {
            go.nextOwnerMask = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'Flags'))
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
        if (prop = this.getFromXMLJS(obj, 'TextureAnimation'))
        {
            const buf = Buffer.from(prop, 'base64');
            go.textureAnim = TextureAnim.from(buf);
        }
        if (prop = this.getFromXMLJS(obj, 'ParticleSystem'))
        {
            const buf = Buffer.from(prop, 'base64');
            go.Particles = ParticleSystem.from(buf);
        }
        if (prop = this.getFromXMLJS(obj, 'PhysicsShapeType'))
        {
            go.physicsShapeType = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'SoundID'))
        {
            go.Sound = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'SoundGain'))
        {
            go.SoundGain = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'SoundFlags'))
        {
            go.SoundFlags = prop;
        }
        if (prop = UUID.fromXMLJS(obj, 'SoundRadius'))
        {
            go.SoundRadius = prop;
        }
        if (prop = this.getFromXMLJS(obj, 'Shape'))
        {
            const shape = prop;
            if (prop = this.getFromXMLJS(shape, 'ProfileCurve'))
            {
                go.ProfileCurve = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'TextureEntry'))
            {
                const buf = Buffer.from(prop, 'base64');
                go.TextureEntry = new TextureEntry(buf);
            }
            if (prop = this.getFromXMLJS(shape, 'PathBegin'))
            {
                go.PathBegin = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathCurve'))
            {
                go.PathCurve = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathEnd'))
            {
                go.PathEnd = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathRadiusOffset'))
            {
                go.PathRadiusOffset = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathRevolutions'))
            {
                go.PathRevolutions = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathScaleX'))
            {
                go.PathScaleX = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathScaleY'))
            {
                go.PathScaleY = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathShearX'))
            {
                go.PathShearX = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathSkew'))
            {
                go.PathSkew = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathTaperX'))
            {
                go.PathTaperX = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathTaperY'))
            {
                go.PathTaperY = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathTwist'))
            {
                go.PathTwist = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PathTwistBegin'))
            {
                go.PathTwistBegin = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'PCode'))
            {
                go.PCode = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'ProfileBegin'))
            {
                go.ProfileBegin = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'ProfileEnd'))
            {
                go.ProfileEnd = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'ProfileHollow'))
            {
                go.ProfileHollow = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'State'))
            {
                go.State = prop;
            }
            if (prop = this.getFromXMLJS(shape, 'ProfileShape'))
            {
                if (!go.ProfileCurve)
                {
                    go.ProfileCurve = 0;
                }
                go.ProfileCurve = go.ProfileCurve | parseInt(ProfileShape[prop], 10);
            }
            if (prop = this.getFromXMLJS(shape, 'HollowShape'))
            {
                if (!go.ProfileCurve)
                {
                    go.ProfileCurve = 0;
                }
                go.ProfileCurve = go.ProfileCurve | parseInt(HoleType[prop], 10);
            }
            if (this.getFromXMLJS(shape, 'SculptEntry'))
            {
                const type = this.getFromXMLJS(shape, 'SculptType');
                if (type !== false && type !== undefined)
                {
                    const id = UUID.fromXMLJS(shape, 'SculptTexture');
                    if (id instanceof UUID)
                    {
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
            if (this.getFromXMLJS(shape, 'FlexiEntry'))
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
                    go.extraParams.setFlexiData(flexiSoftness, flexiTension, flexiDrag, flexiGravity, flexiWind, new Vector3([flexiForceX, flexiForceY, flexiForceZ]));
                }
            }
            if (this.getFromXMLJS(shape, 'LightEntry'))
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
                    go.extraParams.setLightData(
                        new Color4(lightColorR, lightColorG, lightColorB, lightColorA),
                        lightRadius,
                        lightCutoff,
                        lightFalloff,
                        lightIntensity
                    );
                }
            }
            if (prop = this.getFromXMLJS(shape, 'ExtraParams'))
            {
                const buf = Buffer.from(prop, 'base64');
                go.extraParams = ExtraParams.from(buf);
            }
        }
        // TODO: TaskInventory



        console.log('BURP');
        process.exit(0);
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

    private async getInventoryXML(xml: XMLElementOrXMLNode, inv: InventoryItem)
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

    private async getXML(xml: XMLElementOrXMLNode, rootPrim: GameObject, linkNum: number)
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
                shape.ele('TextureEntry', this.TextureEntry.binary.toString('base64'));
            }
            if (this.extraParams)
            {
                shape.ele('ExtraParams', this.extraParams.toBase64());
            }
            shape.ele('PathBegin', this.PathBegin);
            shape.ele('PathCurve', this.PathCurve);
            shape.ele('PathEnd', this.PathEnd);
            shape.ele('PathRadiusOffset', this.PathRadiusOffset);
            shape.ele('PathRevolutions', this.PathRevolutions);
            shape.ele('PathScaleX', this.PathScaleX);
            shape.ele('PathScaleY', this.PathScaleY);
            shape.ele('PathShearX', this.PathShearX);
            shape.ele('PathSkew', this.PathSkew);
            shape.ele('PathTaperX', this.PathTaperX);
            shape.ele('PathTaperY', this.PathTaperY);
            shape.ele('PathTwist', this.PathTwist);
            shape.ele('PathTwistBegin', this.PathTwistBegin);
            shape.ele('PCode', this.PCode);
            shape.ele('ProfileBegin', this.ProfileBegin);
            shape.ele('ProfileEnd', this.ProfileEnd);
            shape.ele('ProfileHollow', this.ProfileHollow);
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
