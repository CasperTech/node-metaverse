import {Vector3} from './Vector3';
import {UUID} from './UUID';
import {Quaternion} from './Quaternion';
import {Tree} from '../enums/Tree';
import {SoundFlags} from '..';
import {Vector4} from './Vector4';
import {TextureEntry} from './TextureEntry';
import {Color4} from './Color4';
import {ParticleSystem} from './ParticleSystem';
import {ITreeBoundingBox} from './interfaces/ITreeBoundingBox';
import {NameValue} from './NameValue';
import {PCode} from '../enums/PCode';
import {Utils} from './Utils';
import * as Long from 'long';

export class GameObject
{
    creatorID?: UUID;
    creationDate?: Long;
    baseMask?: number;
    ownerMask?: number;
    groupMask?: number;
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
    physicaImpact?: number;
    resourceImpact?: number;
    linkResourceImpact?: number;
    linkPhysicsImpact?: number;
    limitingType?: string;

    children?: GameObject[];
    rtreeEntry?: ITreeBoundingBox;
    ID = 0;
    FullID = UUID.random();
    ParentID = 0;
    OwnerID = UUID.zero();
    IsAttachment = false;
    NameValue: {[key: string]: NameValue} = {};
    PCode: PCode = PCode.None;

    State?: number;
    CRC?: number;
    Material?: number;
    ClickAction?: number;
    Scale?: Vector3;
    ObjectData?: Buffer;
    UpdateFlags?: number;
    Flags?: number;
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
    TextureAnim?: Buffer;
    Data?: Buffer;
    Text?: string;
    TextColor?: Color4;
    MediaURL?: string;
    PSBlock?: Buffer;
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

    constructor()
    {
        this.Position = Vector3.getZero();
        this.Rotation = Quaternion.getIdentity();
        this.AngularVelocity = Vector3.getZero();
        this.TreeSpecies = 0;
        this.SoundFlags = 0;
        this.SoundRadius = 1.0;
        this.SoundGain = 1.0;
        this.ParentID = 0;
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
}
