import {BBox} from 'rbush-3d/dist';
import {GameObject} from '../GameObject';

export interface ITreeBoundingBox extends BBox
{
    gameObject: GameObject;
}
