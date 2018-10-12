import {Vector3} from './Vector3';
import {UUID} from './UUID';
import {PCode} from '../enums/PCode';
import {Quaternion} from './Quaternion';
import {Tree} from '../enums/Tree';
import {NameValue} from './NameValue';
import {IGameObject} from './interfaces/IGameObject';
import {SoundFlags} from '..';
import {ITreeBoundingBox} from './interfaces/ITreeBoundingBox';

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
    TextureEntry: Buffer;
    TextureAnim: Buffer;
    Data: Buffer;
    Text: string;
    TextColor: Buffer;
    MediaURL: string;
    PSBlock: Buffer;
    OwnerID: UUID;
    JointType: number;
    JointPivot: Vector3;
    JointAxisOrAnchor: Vector3;
    Position: Vector3;
    Rotation: Quaternion;
    AngularVelocity: Vector3;
    TreeSpecies: Tree;
    Sound: UUID;
    SoundGain: number;
    SoundFlags: SoundFlags;
    SoundRadius: number;
    IsAttachment: boolean;
    NameValue: {[key: string]: NameValue};
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
