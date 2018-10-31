import {BBox} from 'rbush-3d/dist';
import {GameObject} from '../public/GameObject';

export interface ITreeBoundingBox extends BBox
{
    gameObject: GameObject;
}
