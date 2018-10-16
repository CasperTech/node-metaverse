import {Vector3} from './Vector3';
import {UUID} from './UUID';
import {PCode} from '../enums/PCode';
import {Quaternion} from './Quaternion';
import {Tree} from '../enums/Tree';
import {NameValue} from './NameValue';
import {IGameObject} from './interfaces/IGameObject';
import {SoundFlags} from '..';
import {ITreeBoundingBox} from './interfaces/ITreeBoundingBox';
import {Vector4} from './Vector4';
import {TextureEntry} from './TextureEntry';
import {Color4} from './Color4';
import {ParticleSystem} from './ParticleSystem';

export class GameObjectFull implements IGameObject
{
    rtreeEntry?: ITreeBoundingBox;
    ID: number;
    State: number;
    FullID: UUID;
    CRC: number;
    PCode: PCode;
    Material: number;
    ClickAction: number;
    Scale: Vector3;
    ObjectData: Buffer;
    ParentID: number;
    UpdateFlags: number;
    Flags: number;
    PathCurve: number;
    ProfileCurve: number;
    PathBegin: number;
    PathEnd: number;
    PathScaleX: number;
    PathScaleY: number;
    PathShearX: number;
    PathShearY: number;
    PathTwist: number;
    PathTwistBegin: number;
    PathRadiusOffset: number;
    PathTaperX: number;
    PathTaperY: number;
    PathRevolutions: number;
    PathSkew: number;
    ProfileBegin: number;
    ProfileEnd: number;
    ProfileHollow: number;
    TextureEntry: TextureEntry;
    TextureAnim: Buffer;
    Data: Buffer;
    Text: string;
    TextColor: Color4;
    MediaURL: string;
    PSBlock: Buffer;
    OwnerID: UUID;
    JointType: number;
    JointPivot: Vector3;
    JointAxisOrAnchor: Vector3;
    Position: Vector3;
    Rotation: Quaternion;
    CollisionPlane: Vector4;
    Velocity: Vector3;
    Acceleration: Vector3;
    AngularVelocity: Vector3;
    TreeSpecies: Tree;
    Sound: UUID;
    SoundGain: number;
    SoundFlags: SoundFlags;
    SoundRadius: number;
    IsAttachment: boolean;
    NameValue: {[key: string]: NameValue};
    Particles: ParticleSystem;
    constructor()
    {
        this.Position = Vector3.getZero();
        this.Rotation = Quaternion.getIdentity();
        this.IsAttachment = false;
        this.NameValue = {};
        this.AngularVelocity = Vector3.getZero();
        this.TreeSpecies = 0;
        this.SoundFlags = 0;
        this.SoundRadius = 1.0;
        this.SoundGain = 1.0;
        this.ParentID = 0;
    }

    hasNameValueEntry(key: string): boolean
    {
        if (this.NameValue['AttachItemID'])
        {
            return true;
        }
        return false;
    }

    getNameValueEntry(key: string): string
    {
        if (this.NameValue['AttachItemID'])
        {
            return this.NameValue['AttachItemID'].value;
        }
        return '';
    }
}
