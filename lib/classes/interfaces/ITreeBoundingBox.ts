import {BBox} from 'rbush-3d/dist';
import {IGameObject} from './IGameObject';

export interface ITreeBoundingBox extends BBox
{
    gameObject: IGameObject;
}
