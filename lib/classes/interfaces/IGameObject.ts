import {ITreeBoundingBox} from './ITreeBoundingBox';

export interface IGameObject
{
    rtreeEntry?: ITreeBoundingBox;
    hasNameValueEntry(key: string): boolean;
    getNameValueEntry(key: string): string;
}
