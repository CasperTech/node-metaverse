import type { BBox } from 'rbush-3d/dist';
import type { GameObject } from '../public/GameObject';

export interface ITreeBoundingBox extends BBox
{
    gameObject: GameObject;
}
