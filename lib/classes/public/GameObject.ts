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
import {FlexibleData} from './FlexibleData';
import {LightData} from './LightData';
import {LightImageData} from './LightImageData';
import {SculptData} from './SculptData';
import {MeshData} from './MeshData';
import {PCode, PrimFlags, SoundFlags} from '../..';
import * as builder from 'xmlbuilder';
import {XMLElementOrXMLNode} from 'xmlbuilder';
import {Region} from '../Region';
import {TextureAnimFlags} from '../../enums/TextureAnimFlags';
import {ProfileShape} from '../../enums/ProfileShape';
import {HoleType} from '../../enums/HoleType';
import {PhysicsShapeType} from '../../enums/PhysicsShapeType';
import {InventoryItem} from '../InventoryItem';

export class GameObject implements IGameObjectData
{
    rtreeEntry?: ITreeBoundingBox;
    TextureAnim?: Buffer;
    Data?: Buffer;
    ObjectData?: Buffer;
    PSBlock?: Buffer;

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
    ExtraParams?: Buffer;
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
    FlexibleData?: FlexibleData;
    LightData?: LightData;
    LightImageData?: LightImageData;
    SculptData?: SculptData;
    MeshData?: MeshData;
    TextureAnimFlags?: TextureAnimFlags;
    TextureAnimFace?: number;
    TextureAnimSizeX?: number;
    TextureAnimSizeY?: number;
    TextureAnimStart?: number;
    TextureAnimLength?: number;
    TextureAnimRate?: number;

    density?: number;
    friction?: number;
    gravityMultiplier?: number;
    physicsShapeType?: PhysicsShapeType;
    restitution?: number;

    region: Region;

    inventory: InventoryItem[] = [];

    resolveAttempts = 0;

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

    private getInventoryXML(xml: XMLElementOrXMLNode, inv: InventoryItem)
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
            item.ele('Flags', inv.flags);
            item.ele('InvType', inv.inventoryType);
            UUID.getXML(item.ele('ParentID'), this.FullID);
            UUID.getXML(item.ele('ParentPartID'), this.FullID);
            item.ele('Type', inv.type);
            item.ele('Name', inv.name);
        }
    }

    private getXML(xml: XMLElementOrXMLNode, rootPrim: GameObject, linkNum: number)
    {
        const sceneObjectPart = xml.ele('SceneObjectPart').att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance').att('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema');
        sceneObjectPart.ele('AllowedDrop', (this.Flags !== undefined && (this.Flags & PrimFlags.AllowInventoryDrop) !== 0) ? 'true' : 'false');
        UUID.getXML(sceneObjectPart.ele('CreatorID'), this.creatorID);
        sceneObjectPart.ele('CreatorData', 'node-metaverse');
        UUID.getXML(sceneObjectPart.ele('CreatorID'), this.folderID);
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
            if (this.ExtraParams)
            {
                shape.ele('ExtraParams', this.ExtraParams.toString('base64'));
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
            if (this.MeshData !== undefined)
            {
                shape.ele('SculptType', this.MeshData.type);
                UUID.getXML(shape.ele('SculptTexture'), this.MeshData.meshData);
                shape.ele('SculptEntry', true);
            }
            else if (this.SculptData !== undefined)
            {
                shape.ele('SculptType', this.SculptData.type);
                UUID.getXML(shape.ele('SculptTexture'), this.SculptData.texture);
                shape.ele('SculptEntry', true);
            }
            else
            {
                shape.ele('SculptEntry', false);
            }
            if (this.FlexibleData !== undefined)
            {
                shape.ele('FlexiSoftness', this.FlexibleData.Softness);
                shape.ele('FlexiTension', this.FlexibleData.Tension);
                shape.ele('FlexiDrag', this.FlexibleData.Drag);
                shape.ele('FlexiGravity', this.FlexibleData.Gravity);
                shape.ele('FlexiWind', this.FlexibleData.Wind);
                shape.ele('FlexiForceX', this.FlexibleData.Force.x);
                shape.ele('FlexiForceY', this.FlexibleData.Force.y);
                shape.ele('FlexiForceZ', this.FlexibleData.Force.z);
                shape.ele('FlexiEntry', true);
            }
            else
            {
                shape.ele('FlexiEntry', false);
            }
            if (this.LightData !== undefined)
            {
                shape.ele('LightColorR', this.LightData.Color.red);
                shape.ele('LightColorG', this.LightData.Color.green);
                shape.ele('LightColorB', this.LightData.Color.blue);
                shape.ele('LightColorA', this.LightData.Color.alpha);
                shape.ele('LightRadius', this.LightData.Radius);
                shape.ele('LightCutoff', this.LightData.Cutoff);
                shape.ele('LightFalloff', this.LightData.Falloff);
                shape.ele('LightIntensity', this.LightData.Intensity);
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
        if (this.TextureAnim)
        {
            sceneObjectPart.ele('TextureAnimation', this.TextureAnim.toString('base64'));
        }
        if (this.Particles && this.PSBlock)
        {
            sceneObjectPart.ele('ParticleSystem', this.PSBlock.toString('base64'));
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
                this.getInventoryXML(inventory, inv);
            }
        }
    }

    exportXML(): string
    {
        const document = builder.create('SceneObjectGroup');
        let linkNum = 1;
        this.getXML(document, this, linkNum);
        if (this.children && this.children.length > 0)
        {
            const otherParts = document.ele('OtherParts');
            for (const child of this.children)
            {
                child.getXML(otherParts, this, ++linkNum);
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
            FlexibleData: this.FlexibleData,
            LightData: this.LightData,
            LightImageData: this.LightImageData,
            SculptData: this.SculptData,
            MeshData: this.MeshData,
            density: this.density,
            friction: this.friction,
            gravityMultiplier: this.gravityMultiplier,
            physicsShapeType: this.physicsShapeType,
            restitution: this.restitution
        }
    }
}
