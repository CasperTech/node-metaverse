import {ITreeBoundingBox} from './ITreeBoundingBox';
import {UUID} from '../UUID';
import {PCode} from '../../enums/PCode';

export interface IGameObject
{
    ID: number;
    FullID: UUID;
    ParentID: number;
    OwnerID: UUID;
    IsAttachment: boolean;
    PCode: PCode;
    rtreeEntry?: ITreeBoundingBox;
    hasNameValueEntry(key: string): boolean;
    getNameValueEntry(key: string): string;
}
